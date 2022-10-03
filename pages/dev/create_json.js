import fs from "fs";

export default function create_json() {}

export async function getStaticProps() {
  var obj = {
    alpukat: {
        show_name: "Alpukat",
        image_file: ["alpukat_1.png", "alpukat_2.png"],
        sound_file: ["alpukat.mp3"]
    },
    apel: {
        show_name: "Apel",
        image_file: ["apel_1.png", "apel_2.png"],
        sound_file: ["apel.mp3"]
    },
    duku: {
        show_name: "Duku",
        image_file: ["duku_1.png", "duku_2.png"],
        sound_file: ["duku.mp3"]
    },
    jambu_biji: {
        show_name: "Apel",
        image_file: ["jambu biji_1.png", "jambu biji_2.png"],
        sound_file: ["jambu biji.mp3"]
    },
    mangga: {
        show_name: "Mangga",
        image_file: ["mangga_1.png", "mangga_2.png"],
        sound_file: ["mangga.mp3"]
    },
    manggis: {
        show_name: "Manggis",
        image_file: ["manggis_1.png", "manggis_2.png"],
        sound_file: ["manggis.mp3"]
    },
    nanas: {
        show_name: "Nanas",
        image_file: ["nanas_1.png", "nanas_2.png"],
        sound_file: ["nanas.mp3"]
    },
    pisang: {
        show_name: "Pisang",
        image_file: ["pisang_1.png", "pisang_2.png"],
        sound_file: ["pisang.mp3"]
    },
    salak: {
        show_name: "Salak",
        image_file: ["salak_1.png", "salak_2.png"],
        sound_file: ["salak.mp3"]
    },
    semangka: {
        show_name: "Semangka",
        image_file: ["semangka_1.png", "semangka_2.png"],
        sound_file: ["semangka.mp3"]
    },
  };

  var json = JSON.stringify(obj);

  fs.writeFile("./database/flash-card/buah.json", json, "utf8", function (err) {
    if (err) throw err;
    console.log("complete");
  });

  return {
    props: {
      duh: "lol",
    },
  };
}
