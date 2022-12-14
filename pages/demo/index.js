import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import stylesCustom from "../../styles/custom.module.css";
import stylesCoach from "../../styles/coach.module.css";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";

import { getJSONCategory } from "../../utils/getLocalJSON";
import { getLocale } from "../../utils/getLocaleText";
import { FooterLogo } from "../../components/general";

//TODO : Atur Category Card agar kalau jumlah itemnya 6, bagus keliatanya
//TODO : Fit Screen No Scroll untuk pad dan Laptop

export default function HomePlay(props) {
  const router = useRouter();
  const [pickGame, setPickGame] = useState(false);
  const [gameType, setGameType] = useState("");
  const [nowCoach, setNowCoach] = useState(1);

  const kategoriObj = props.kategori_data;
  const localeGeneral = props.localeData.general;

  const kategoriArray = [];
  var tempArray = [];

  Object.keys(kategoriObj).map((key, id) => {
    var classTemp = stylesCustom.card_menu_disabled;
    if (key === "buah" || key === "hewan") {
      classTemp = stylesCustom.card_menu;
    }
    tempArray.push(
      <div
        key={id}
        onClick={() => (key === "buah" || key === "hewan" ? router.push({ pathname: "/demo/" + gameType + "/" + key }) : alert("Belum Tersedia"))}
        className={classTemp}
        style={{ marginRight: "15px", padding: "10px 10px 5px", display: "block", overflow: "auto" }}
      >
        <Image src={`/assets/items/${key}/image/${kategoriObj[key].image_file[0]}`} width={"600vw"} height={"600vw"} alt="PlayButton"></Image>
        <h2 style={{ textAlign: "center", fontSize: "2vw" }}>{kategoriObj[key].show_name} &rarr;</h2>
      </div>
    );
    if ((id + 1) % 4 == 0 && id != 0) {
      kategoriArray.push(tempArray);
      tempArray = [];
    }
    if (id + 1 == Object.keys(kategoriObj).length) {
      kategoriArray.push(tempArray);
      tempArray = [];
    }
  });

  function setGame(type) {
    setGameType(type);
    setPickGame(true);
  }

  function nextCoach() {
    setNowCoach(nowCoach + 1);
  }

  function nextPage() {
    setGame("mengeja-gambar");
    setNowCoach(nowCoach + 1);
  }

  function nextGame() {
    router.push({ pathname: "/demo/mengeja-gambar/buah" });
  }

  function prevCoach() {
    setNowCoach(nowCoach - 1);
  }

  return (
    <div className={(styles.container, stylesCustom.backgound_image)} style={{ backgroundImage: "url('/bg.jpg')" }}>
      <Head>
        <title>Vibio</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={stylesCoach.root}>
        <motion.div
          className={styles.main}
          animate={pickGame ? "closed" : "open"}
          variants={{
            open: { opacity: 1, x: 0 },
            closed: { opacity: 0, x: "-100%" },
          }}
        >
          <h2 className={stylesCustom.menu_title_font}>{localeGeneral.play_title1}</h2>
          <h4>{localeGeneral.play_subtitle2}</h4>
          <br></br>

          <div className={nowCoach == 3 ? stylesCoach.container_card_jenis_permainan_coach : stylesCustom.container_card_jenis_permainan}>
            <div onClick={() => (nowCoach == 3 ? setGame("mengeja-gambar") : "")} className={nowCoach == 1 ? stylesCoach.card_menu_wImage_coach : stylesCustom.card_menu_wImage}>
              <Image style={{ borderRadius: "30px" }} src={`/assets/vector/mengeja-image.jpg`} width={300} height={300} alt="mengejaGambar"></Image>
              <h2 style={{ textAlign: "center", wordWrap: "break-word" }}>{localeGeneral.play_choose_title1} &rarr;</h2>
              <p style={{ textAlign: "center", wordWrap: "break-word" }}>{localeGeneral.play_choose_subtitle1}</p>
            </div>
            <CoachPop2 show={nowCoach == 2 ? true : false} nextFunction={nextCoach}></CoachPop2>
            <CoachPop1 show={nowCoach == 1 ? true : false} nextFunction={nextCoach}></CoachPop1>

            <div onClick={() => (nowCoach == 3 ? setGame("tebak-gambar") : "")} className={nowCoach == 2 ? stylesCoach.card_menu_wImage_coach : stylesCustom.card_menu_wImage}>
              <Image style={{ borderRadius: "30px" }} src={`/assets/vector/tebak-image.jpg`} width={300} height={300} alt="tebakGambar"></Image>
              <h2 style={{ textAlign: "center", wordWrap: "break-word" }}>{localeGeneral.play_choose_title2} &rarr;</h2>
              <p style={{ textAlign: "center", wordWrap: "break-word" }}>{localeGeneral.play_choose_subtitle2}</p>
            </div>
          </div>
          <FooterLogo></FooterLogo>
        </motion.div>
        <motion.div
          className={styles.main}
          animate={pickGame ? "open" : "closed"}
          variants={{
            open: { opacity: 1, x: 0 },
            closed: { opacity: 0, x: "-100%" },
          }}
          style={{ position: "absolute", top: "0", left: "0", opacity: "0" }}
        >
          <CoachPop3 show={nowCoach == 3 ? true : false} nextFunction={nextGame}></CoachPop3>
          <h2 className={stylesCustom.menu_title_font}>{localeGeneral.play_title2}</h2>
          <h4>{localeGeneral.play_subtitle2}</h4>
          <br></br>

          <div className={stylesCoach.grid_kategori_benda_container_coach}>
            {kategoriArray.map((value, id) => {
              return (
                <div key={id} className={stylesCustom.grid_kategori_benda}>
                  {kategoriArray[id]}
                </div>
              );
            })}
          </div>
          <FooterLogo></FooterLogo>
        </motion.div>
      </main>
      <div style={{ position: "absolute", top: "5vh", left: "5vh", cursor: "pointer" }} onClick={() => router.push("/home")}>
        <div className={stylesCustom.button_card}>
          <h4 style={{ marginBottom: "0px", color: "green" }}>Home</h4>
        </div>
      </div>
      <audio controls loop autoPlay src={"/assets/music/bg-music1.wav"} style={{ display: "none" }}></audio>
    </div>
  );
}

// export async function getStaticProps(context) {

//   return {
//     props: {
//       localeData: {
//         general: localeDataGeneral,
//       },
//     },
//   };
// }

const CoachPop1 = (props) => {
  if (props.show == true) {
    return (
      <div className={stylesCoach.hcm_tooltip_base_right}>
        <div className={stylesCoach.hcm_tooltip_base} style={{ maxWidth: "25%" }}>
          <h6>
            <strong>Judul Coach mark</strong>
          </h6>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur volutpat tortor facilisis nunc tincidunt dapibus. Duis lacus ex, volutpat ut eros et, accumsan accumsan metus.
            Vivamus eget finibus ligula.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              props.nextFunction();
            }}
          >
            Selanjutnya
          </button>
        </div>
      </div>
    );
  }
};

const CoachPop2 = (props) => {
  if (props.show == true) {
    return (
      <div dir="rtl" className={stylesCoach.hcm_tooltip_base_right}>
        <div className={stylesCoach.hcm_tooltip_base} style={{ maxWidth: "25%" }}>
          <h6>
            <strong>Judul Coach mark</strong>
          </h6>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur volutpat tortor facilisis nunc tincidunt dapibus. Duis lacus ex, volutpat ut eros et, accumsan accumsan metus.
            Vivamus eget finibus ligula.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              props.nextFunction();
            }}
          >
            Selanjutnya
          </button>
        </div>
      </div>
    );
  }
};

const CoachPop3 = (props) => {
  if (props.show == true) {
    return (
      <div className={stylesCoach.hcm_tooltip_base_right}>
        <div className={stylesCoach.hcm_tooltip_base} style={{ maxWidth: "25%" }}>
          <h6>
            <strong>Judul Coach mark</strong>
          </h6>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur volutpat tortor facilisis nunc tincidunt dapibus. Duis lacus ex, volutpat ut eros et, accumsan accumsan metus.
            Vivamus eget finibus ligula.
          </p>
        </div>
      </div>
    );
  }
};

export const getStaticProps = async (context) => {
  var kategori_data = getJSONCategory();
  var localeDataGeneral = getLocale("id", "general");
  return {
    props: {
      kategori_data: kategori_data,
      localeData: {
        general: localeDataGeneral,
      },
    },
  };
};
