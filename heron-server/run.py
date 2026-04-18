import uvicorn
import os

if __name__ == "__main__":
    port_str = os.getenv("PORT", "8000")
    if not port_str:
        port_str = "8000"
        
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(port_str),
    )