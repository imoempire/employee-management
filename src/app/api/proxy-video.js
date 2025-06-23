export default async function handler(req, res) {
    const { url } = req.query;
  
    // Validate the URL parameter
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Invalid or missing URL parameter" });
    }
  
    try {
      const response = await fetch(url, { method: "GET" });
  
      if (!response.ok) {
        return res
          .status(response.status)
          .json({ error: `Failed to fetch video: ${response.statusText}` });
      }
  
      // Set response headers
      res.setHeader("Content-Type", response.headers.get("content-type") || "video/mp4");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "no-cache");
  
      // Stream the video content
      const buffer = await response.arrayBuffer();
      res.send(Buffer.from(buffer));
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).json({ error: "Failed to proxy video" });
    }
  }