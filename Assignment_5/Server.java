package com.example;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import fi.iki.elonen.NanoHTTPD;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

/**
 * Minimal REST CRUD server over MongoDB, plus a static file server for the
 * frontend in src/main/resources/public/.
 *
 * Endpoints (see API_INTERFACE.md for the full writeup):
 *   POST   /api/items      create
 *   GET    /api/items      list
 *   GET    /api/items/{id} read one
 *   PUT    /api/items/{id} update
 *   DELETE /api/items/{id} delete
 *
 * Run with: java -jar target/nanohttpd-mongo-starter.jar
 */
public class Server extends NanoHTTPD {

    private final MongoCollection<Document> collection;

    public Server(int port, String mongoUri, String dbName, String collectionName) {
        super(port);
        MongoClient client = MongoClients.create(mongoUri);
        this.collection = client.getDatabase(dbName).getCollection(collectionName);
    }

    public static void main(String[] args) throws IOException {
        int port = Integer.parseInt(System.getProperty("port", "8080"));
        String mongoUri = System.getProperty("mongoUri", "mongodb://localhost:27017");
        Server server = new Server(port, mongoUri, "mydb", "items");
        server.start(NanoHTTPD.SOCKET_READ_TIMEOUT, false);
        System.out.println("Server running at http://localhost:" + port);
    }

    @Override
    public Response serve(IHTTPSession session) {
        if (session.getMethod() == Method.OPTIONS) {
            return withCors(newFixedLengthResponse(Response.Status.OK, "text/plain", ""));
        }
        try {
            return withCors(route(session));
        } catch (IllegalArgumentException e) {
            return withCors(error(Response.Status.BAD_REQUEST, e.getMessage()));
        } catch (Exception e) {
            return withCors(error(Response.Status.INTERNAL_ERROR, e.getMessage()));
        }
    }

    private Response route(IHTTPSession session) throws IOException, ResponseException {
        String uri = session.getUri();
        Method method = session.getMethod();

        if (!uri.startsWith("/api/items")) {
            return serveStatic(uri);
        }

        String id = uri.equals("/api/items") ? null : uri.substring("/api/items/".length());

        if (id == null && method == Method.GET) return list();
        if (id == null && method == Method.POST) return create(session);
        if (id != null && method == Method.GET) return read(id);
        if (id != null && method == Method.PUT) return update(session, id);
        if (id != null && method == Method.DELETE) return delete(id);

        return error(Response.Status.NOT_FOUND, "no such route");
    }

    // ---------- CRUD ----------

    private Response list() {
        JSONArray arr = new JSONArray();
        for (Document doc : collection.find()) arr.put(toClientJson(doc));
        return json(Response.Status.OK, arr.toString());
    }

    private Response create(IHTTPSession session) throws IOException, ResponseException {
        Document doc = Document.parse(readBody(session));
        doc.remove("_id"); // never trust a client-supplied id on create
        collection.insertOne(doc); // driver fills in doc's _id in place
        return json(Response.Status.CREATED, toClientJson(doc).toString());
    }

    private Response read(String id) {
        Document doc = collection.find(new Document("_id", toObjectId(id))).first();
        if (doc == null) return error(Response.Status.NOT_FOUND, "not found");
        return json(Response.Status.OK, toClientJson(doc).toString());
    }

    private Response update(IHTTPSession session, String id) throws IOException, ResponseException {
        Document update = Document.parse(readBody(session));
        update.remove("_id"); // never overwrite the id
        long matched = collection.replaceOne(new Document("_id", toObjectId(id)), update).getMatchedCount();
        if (matched == 0) return error(Response.Status.NOT_FOUND, "not found");
        return json(Response.Status.OK, new JSONObject().put("status", "updated").put("id", id).toString());
    }

    private Response delete(String id) {
        long deleted = collection.deleteOne(new Document("_id", toObjectId(id))).getDeletedCount();
        if (deleted == 0) return error(Response.Status.NOT_FOUND, "not found");
        return json(Response.Status.OK, new JSONObject().put("status", "deleted").toString());
    }

    // ---------- static files ----------

    private Response serveStatic(String uri) throws IOException {
        String path = uri.equals("/") ? "/index.html" : uri;
        InputStream is = getClass().getResourceAsStream("/public" + path);
        if (is == null) return newFixedLengthResponse(Response.Status.NOT_FOUND, "text/plain", "404 Not Found");
        String mime = path.endsWith(".css") ? "text/css"
                : path.endsWith(".js") ? "application/javascript"
                : "text/html";
        return newChunkedResponse(Response.Status.OK, mime, is);
    }

    // ---------- helpers ----------

    private String readBody(IHTTPSession session) throws IOException, ResponseException {
        Map<String, String> files = new HashMap<>();
        session.parseBody(files);
        if (files.containsKey("postData")) return files.get("postData");           // POST body
        if (files.containsKey("content")) {                                        // PUT body (NanoHTTPD quirk)
            return new String(Files.readAllBytes(Paths.get(files.get("content"))), StandardCharsets.UTF_8);
        }
        return "{}";
    }

    private ObjectId toObjectId(String id) {
        if (!ObjectId.isValid(id)) throw new IllegalArgumentException("invalid id: " + id);
        return new ObjectId(id);
    }

    /** Converts Mongo's "_id": {"$oid": "..."} into a plain "id" string for clients. */
    private JSONObject toClientJson(Document doc) {
        JSONObject obj = new JSONObject(doc.toJson());
        if (obj.has("_id")) {
            Object raw = obj.remove("_id");
            String idStr = (raw instanceof JSONObject && ((JSONObject) raw).has("$oid"))
                    ? ((JSONObject) raw).getString("$oid")
                    : String.valueOf(raw);
            obj.put("id", idStr);
        }
        return obj;
    }

    private Response json(Response.Status status, String body) {
        return newFixedLengthResponse(status, "application/json", body);
    }

    private Response error(Response.Status status, String message) {
        return json(status, new JSONObject().put("error", message == null ? "" : message).toString());
    }

    private Response withCors(Response response) {
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Headers", "Content-Type");
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        return response;
    }
}