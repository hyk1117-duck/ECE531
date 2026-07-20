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
 * A small NanoHTTPD web server that:
 *   - Serves a static frontend (src/main/resources/public/*)
 *   - Exposes a JSON REST API backed by MongoDB at /api/items
 *
 * Run with:  java -jar target/nanohttpd-mongo-starter.jar
 */
public class Server extends NanoHTTPD {

    private final MongoClient mongoClient;
    private final MongoCollection<Document> collection;

    public Server(int port, String mongoUri, String dbName, String collectionName) {
        super(port);
        this.mongoClient = MongoClients.create(mongoUri);
        MongoDatabase database = mongoClient.getDatabase(dbName);
        this.collection = database.getCollection(collectionName);
    }

    public static void main(String[] args) throws IOException {
        int port = Integer.parseInt(System.getProperty("port", "8080"));
        // Swap this for a MongoDB Atlas SRV string if you're using the cloud:
        // "mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority"
        String mongoUri = System.getProperty("mongoUri", "mongodb://localhost:27017");

        Server server = new Server(port, mongoUri, "mydb", "items");
        server.start(NanoHTTPD.SOCKET_READ_TIMEOUT, false);
        System.out.println("Server running at http://localhost:" + port);
    }

    @Override
    public Response serve(IHTTPSession session) {
        String uri = session.getUri();
        Method method = session.getMethod();

        // Handle CORS preflight
        if (method == Method.OPTIONS) {
            return withCors(newFixedLengthResponse(Response.Status.OK, "text/plain", ""));
        }

        try {
            Response response;
            if (uri.equals("/api/items") && method == Method.GET) {
                response = getAllItems();
            } else if (uri.startsWith("/api/items/") && method == Method.GET) {
                response = getItem(idFromUri(uri));
            } else if (uri.equals("/api/items") && method == Method.POST) {
                response = createItem(session);
            } else if (uri.startsWith("/api/items/") && method == Method.PUT) {
                response = updateItem(session, idFromUri(uri));
            } else if (uri.startsWith("/api/items/") && method == Method.DELETE) {
                response = deleteItem(idFromUri(uri));
            } else {
                response = serveStatic(uri);
            }
            return withCors(response);
        } catch (IllegalArgumentException e) {
            return withCors(json(Response.Status.BAD_REQUEST, "{\"error\":\"" + escape(e.getMessage()) + "\"}"));
        } catch (Exception e) {
            return withCors(json(Response.Status.INTERNAL_ERROR, "{\"error\":\"" + escape(e.getMessage()) + "\"}"));
        }
    }

    // ---------- API handlers ----------

    private Response getAllItems() {
        JSONArray arr = new JSONArray();
        for (Document doc : collection.find()) {
            arr.put(toClientJson(doc));
        }
        return json(Response.Status.OK, arr.toString());
    }

    private Response getItem(String id) {
        Document doc = collection.find(new Document("_id", toObjectId(id))).first();
        if (doc == null) {
            return json(Response.Status.NOT_FOUND, "{\"error\":\"not found\"}");
        }
        return json(Response.Status.OK, toClientJson(doc).toString());
    }

    private Response createItem(IHTTPSession session) throws IOException, ResponseException {
        JSONObject body = new JSONObject(readBody(session));
        Document doc = Document.parse(body.toString());
        collection.insertOne(doc); // driver fills in doc's _id in place
        return json(Response.Status.CREATED, toClientJson(doc).toString());
    }

    private Response updateItem(IHTTPSession session, String id) throws IOException, ResponseException {
        JSONObject body = new JSONObject(readBody(session));
        Document update = Document.parse(body.toString());
        update.remove("_id"); // never overwrite the id
        long matched = collection.replaceOne(new Document("_id", toObjectId(id)), update).getMatchedCount();
        if (matched == 0) {
            return json(Response.Status.NOT_FOUND, "{\"error\":\"not found\"}");
        }
        return json(Response.Status.OK, "{\"status\":\"updated\",\"id\":\"" + id + "\"}");
    }

    private Response deleteItem(String id) {
        long deleted = collection.deleteOne(new Document("_id", toObjectId(id))).getDeletedCount();
        if (deleted == 0) {
            return json(Response.Status.NOT_FOUND, "{\"error\":\"not found\"}");
        }
        return json(Response.Status.OK, "{\"status\":\"deleted\"}");
    }

    // ---------- Static file serving (the "website" part) ----------

    private Response serveStatic(String uri) throws IOException {
        String path = uri.equals("/") ? "/index.html" : uri;
        InputStream is = getClass().getResourceAsStream("/public" + path);
        if (is == null) {
            return newFixedLengthResponse(Response.Status.NOT_FOUND, "text/plain", "404 Not Found");
        }
        String mime = path.endsWith(".css") ? "text/css"
                : path.endsWith(".js") ? "application/javascript"
                : "text/html";
        return newChunkedResponse(Response.Status.OK, mime, is);
    }

    // ---------- helpers ----------

    private String readBody(IHTTPSession session) throws IOException, ResponseException {
        Map<String, String> files = new HashMap<>();
        session.parseBody(files);
        // POST: a raw (non form-urlencoded) body lands under "postData".
        if (files.containsKey("postData")) {
            return files.get("postData");
        }
        // PUT: NanoHTTPD writes the body to a temp file and gives us its path
        // under "content" instead -- see https://github.com/NanoHttpd/nanohttpd/issues/471
        if (files.containsKey("content")) {
            return new String(Files.readAllBytes(Paths.get(files.get("content"))), StandardCharsets.UTF_8);
        }
        return "{}";
    }

    private String idFromUri(String uri) {
        return uri.substring(uri.lastIndexOf('/') + 1);
    }

    private ObjectId toObjectId(String id) {
        if (!ObjectId.isValid(id)) {
            throw new IllegalArgumentException("invalid id: " + id);
        }
        return new ObjectId(id);
    }

    /**
     * Converts a MongoDB Document to a client-facing JSONObject where "_id"
     * (which doc.toJson() would render as {"$oid": "..."}) becomes a plain
     * "id" string field instead -- much easier for JS/curl/other clients to use.
     */
    private JSONObject toClientJson(Document doc) {
        JSONObject obj = new JSONObject(doc.toJson());
        if (obj.has("_id")) {
            Object rawId = obj.remove("_id");
            String idString = (rawId instanceof JSONObject && ((JSONObject) rawId).has("$oid"))
                    ? ((JSONObject) rawId).getString("$oid")
                    : String.valueOf(rawId);
            obj.put("id", idString);
        }
        return obj;
    }

    private Response json(Response.Status status, String body) {
        return newFixedLengthResponse(status, "application/json", body);
    }

    private Response withCors(Response response) {
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Headers", "Content-Type");
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        return response;
    }

    private String escape(String s) {
        return s == null ? "" : s.replace("\"", "'");
    }
}
