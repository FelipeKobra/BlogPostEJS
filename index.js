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
app.locals.postList = postList
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

function cards (titulo, subtitulo, post, tags, data){
  this.titulo = titulo;
  this.subtitulo = subtitulo;
  this.post = post;
  this.tags = tags;
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
  const card = new cards (req.body.titulo,req.body.subtitulo,req.body.post,req.body.tags,currentDate)
  postList.push(card)
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const indexToRemove = parseInt(req.body.delete.match(/(\d+)/)[1], 10);
  
  if (!isNaN(indexToRemove) && indexToRemove >= 0 && indexToRemove < postList.length) {
    postList.splice(indexToRemove, 1);
  }
  res.redirect("/");
});


app.post("/edit", (req, res) => {
  const selectedIndex = parseInt(req.body.edit, 10);
  const selectedPost = postList[selectedIndex];
    res.render(__dirname + "/views/edit.ejs", {selectedPost,selectedIndex});
  }
);

app.post("/editpos", (req, res) => {
  const indexToUpdate = parseInt(req.body.index, 10);
  const updatedPost = {
      titulo: req.body.titulo,
      subtitulo: req.body.subtitulo,
      post: req.body.post,
      tags: req.body.tags
  };

  // Certifique-se de que o índice é válido antes de atualizar
  if (!isNaN(indexToUpdate) && indexToUpdate >= 0 && indexToUpdate < postList.length) {
      postList[indexToUpdate] = updatedPost;
      console.log("Post atualizado:", updatedPost);
  } else {
      console.log("Índice inválido durante a atualização.");
  }

  res.redirect("/");
});




app.listen(port, () => {
  console.log("Running on " + port);
});
