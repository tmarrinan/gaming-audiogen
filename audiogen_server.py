from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

class StoppableHTTPServer(HTTPServer):
    def run(self):
        try:
            self.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            self.server_close()

class AudioGenHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urlparse(self.path)
        print(f"GET '{parsed_url.path}'")
        
        # send 200 response
        self.send_response(200)
        # send response headers
        self.send_header("Content-Type", "text/html")
        self.end_headers()
        # send the body of the response
        self.wfile.write("<h1>It Works!</h1>".encode("utf-8"))
    
    def log_message(self, format, *args):
        return


port = 8080
httpd = StoppableHTTPServer(("localhost", port), AudioGenHandler)
httpd.run()
