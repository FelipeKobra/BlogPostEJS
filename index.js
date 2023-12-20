import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { compareAsc, format } from "date-fns";

let postList = [];
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.locals.__dirname = __dirname;
app.locals.postList = postList;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

function cards(titulo, subtitulo, post, data) {
  this.titulo = titulo;
  this.subtitulo = subtitulo;
  this.post = post;
  this.data = data;
}

app.get("/", (req, res) => {
  res.render(__dirname + "/views/index.ejs");
});

app.get("/create", (req, res) => {
  res.render(__dirname + "/views/create.ejs");
});

app.post("/create", (req, res) => {
  const currentDate = format(new Date(), "dd/MM/yyyy");
  const card = new cards(
    req.body.titulo,
    req.body.subtitulo,
    req.body.post,
    currentDate
  );
  postList.push(card);
  res.redirect("/");
});

app.get("/post/:id", (req, res) => {
  const index = req.params.id;
  const post = postList[index];
  res.render(__dirname + "/views/post.ejs", {
    index: index,
    titulo: post.titulo,
    subtitulo: post.subtitulo,
    post: post.post,
  });
});

app.post("/delete", (req, res) => {
  const index = req.body.index;
  postList.splice(index, 1);
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  const index = req.body.index;
  const post = postList[index];
  res.render(__dirname + "/views/edit.ejs", {
    index: index,
    titulo: post.titulo,
    subtitulo: post.subtitulo,
    post: post.post,
  });
});

app.post("/editpos", (req, res) => {
  const currentDate = format(new Date(), "dd/MM/yyyy");
  const index = req.body.index;
  const titulo = req.body.titulo;
  const subtitulo = req.body.subtitulo;
  const postWrite = req.body.post;
  postList[index] = new cards(
    titulo,
    subtitulo,
    postWrite,
    currentDate,
  );
  res.redirect("/");
});

app.listen(port, () => {
  console.log("Running on " + port);
});



