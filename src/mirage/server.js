import { Server } from "miragejs";

export default function makeServer() {
  let server = new Server({
    routes() {
      this.namespace = "api";
      this.get("/datapoints", () => {
        console.log('mirage /datapoints!');
        return {
          datapoints: [
            {x: 0, y: 20},
            {x: 5, y: 30},
            {x: 10, y: 35},
            {x: 15, y: 30},
          ]
        };
      });

      this.passthrough('https://d3js.org/**');
      this.passthrough('https://api.songkick.com/**');
    }
  });

  return server;
}
