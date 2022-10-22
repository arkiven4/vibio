import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import stylesCustom from "../styles/custom.module.css";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
const { ipcRenderer } = require("electron");

//TODO : Check is localStorage available in browser, Make User Allow speaker

export default function Index() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [isOnline, setOnline] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [isModalUpdateOk, setIsModalUpdateOk] = useState(false);
  const [updateInfo, setUpdateInfo] = useState({ releaseNotes: "", releaseName: "" });
  const [updateObj, setUpdateObj] = useState({ percent: 0, downloadspd: 0, progressMB: { now: 0, total: 0 } });
  const AudioSoundRef = useRef();

  useEffect(() => {
    AudioSoundRef.current.play();
    setLoading(true);
    fetch("https://www.google.com/", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "no-cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log(res);
        setOnline(true);
      })
      .catch((e) => {
        console.log(e.message);
        setOnline(false);
      })
      .finally(() => {
        setTimeout(() => {
          //router.push("/home");
        }, 2000);
      });

    ipcRenderer.on("download-progress", function (evt, message) {
      setUpdateObj(message);
    });

    ipcRenderer.on("update-available", function (evt, message) {
      console.log(message);
      setUpdateInfo(message);
      setIsModalUpdate(true);
    });

    ipcRenderer.on("update-not-available", function (evt, message) {
      router.push("/home");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateApp = () => {
    setIsModalUpdate(false);
    ipcRenderer.send("accept-update", true);
    setIsModalUpdateOk(true);
  };

  const ignoreUpdate = () => {
    router.push("/home");
  };

  const updateAppClose = () => {
    console.log("Noting");
  };

  return (
    <div className={(styles.container, stylesCustom.backgound_image)} style={{ backgroundImage: "url('/bg2.jpg')" }}>
      <Head>
        <title>Vibio</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <div className={stylesCustom.card}>
          {/* <button type="button" className="btn btn-primary">Warning</button> */}
          <h1 className={styles.title} style={{ textAlign: "center" }}>
            Memuat Vibio.....
          </h1>
          <br></br>

          <div className="progress" style={{ width: "75%" }}>
            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100} style={{ width: "25%" }}>
              25%
            </div>
          </div>
          <br></br>
          {isOnline ? <h3 style={{ color: "green" }}>Online</h3> : <h3 style={{ color: "red" }}>Offline Mode</h3>}
        </div>
        <audio ref={AudioSoundRef} controls loop autoPlay src={"/assets/music/bg-music1.wav"} style={{ display: "none" }}></audio>
        <ModalUpdateAnnaouncement isShow={isModalUpdate} clickUpdate={updateApp} clickIgnore={ignoreUpdate} releaseMessage={updateInfo.releaseNotes}></ModalUpdateAnnaouncement>
        <ModalUpdateAccept isShow={isModalUpdateOk} clickClose={updateAppClose} valueNow={updateObj.percent} valueSPDNow={updateObj.downloadspd} progressMB={updateObj.progressMB}></ModalUpdateAccept>
      </main>
    </div>
  );
}

const ModalUpdateAccept = (props) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0,
      }}
      animate={props.isShow ? "open" : "closed"}
      variants={{
        open: { opacity: 1, scale: 1 },
        closed: { opacity: 0, scale: 0 },
      }}
      className={stylesCustom.popup_backdrop}
    >
      <motion.div className={stylesCustom.popup}>
        <motion.h3 className={`${stylesCustom.mini_card_popupRW}`} style={{ color: "black" }}>
          Pembaharuan Sedang Diunduh..
        </motion.h3>
        <motion.div className={stylesCustom.pu_content_container}>
          <motion.div
            initial={{
              scale: 0,
              rotate: 0,
            }}
            animate={{
              scale: 1,
              rotate: 360,
              transition: {
                delay: 0.3,
                duration: 0.5,
              },
            }}
            style={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <motion.div className={stylesCustom.popup_card}>
              <motion.div
                initial={{
                  scale: 1,
                  rotate: 0,
                }}
                animate={{
                  rotate: [-2, 2, -2, 2, -2],
                  scale: [1.01, 0.99, 1.01, 0.99, 1.01],
                }}
                transition={{
                  duration: 1.5,
                  times: [0.3, 0.6, 0.9, 1.2, 1.5],
                  repeat: Infinity,
                }}
              >
                <Image src={"/assets/emoji_good.png"} width={150} height={150} alt="PlayButton" style={{ cursor: "pointer" }} />
              </motion.div>
              <div className="progress" style={{ width: "75%", margin: "20px 0" }}>
                <div className="progress-bar progress-bar-animated" role="progressbar" aria-valuenow={props.valueNow} aria-valuemin={0} aria-valuemax={100} style={{ width: props.valueNow + "%" }}>
                  {props.valueNow}%
                </div>
              </div>
              {props.progressMB.total == 0 ? (
                <motion.div>
                  <motion.p style={{ textAlign: "center", marginBottom: 5, marginTop: 0 }}> Pengecekan Instalasi.....</motion.p>
                </motion.div>
              ) : (
                <motion.div>
                  <motion.p style={{ textAlign: "center", marginBottom: 5, marginTop: 0 }}> Terdownload : {formatBytes(props.progressMB.now) + "/" + formatBytes(props.progressMB.total)}</motion.p>
                  <motion.p style={{ textAlign: "center", marginBottom: 5 }}> Kecepatan Download : {formatBytes(props.valueSPDNow)}</motion.p>
                </motion.div>
              )}

              <motion.h5 style={{ textAlign: "center" }}>
                Untuk Sementara Aplikasi Tidak bisa Digunakan
                <br />
                Aplikasi Akan Dimuat Ulang Secara Otomatis saat pembaharuan sudah diterapkan
              </motion.h5>
            </motion.div>
          </motion.div>
        </motion.div>
        {/* button controls */}
        {/* <motion.div style={{ marginTop: "10px" }}>
          <motion.button
            className="btn btn-primary"
            onClick={() => {
              props.clickClose();
            }}
            style={{ margin: "0" }}
          >
            Mengerti
          </motion.button>
        </motion.div> */}
      </motion.div>
    </motion.div>
  );
};

const ModalUpdateAnnaouncement = (props) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0,
      }}
      animate={props.isShow ? "open" : "closed"}
      variants={{
        open: { opacity: 1, scale: 1 },
        closed: { opacity: 0, scale: 0 },
      }}
      className={stylesCustom.popup_backdrop}
    >
      <motion.div className={stylesCustom.popup}>
        <motion.h3 className={`${stylesCustom.mini_card_popupRW}`} style={{ color: "black" }}>
          Pembaharuan Tersedia
        </motion.h3>
        <motion.div className={stylesCustom.pu_content_container}>
          <motion.div
            initial={{
              scale: 0,
              rotate: 0,
            }}
            animate={{
              scale: 1,
              rotate: 360,
              transition: {
                delay: 0.3,
                duration: 0.5,
              },
            }}
            style={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <motion.div className={stylesCustom.popup_card}>
              <motion.div
                initial={{
                  scale: 1,
                  rotate: 0,
                }}
                animate={{
                  rotate: [-2, 2, -2, 2, -2],
                  scale: [1.01, 0.99, 1.01, 0.99, 1.01],
                }}
                transition={{
                  duration: 1.5,
                  times: [0.3, 0.6, 0.9, 1.2, 1.5],
                  repeat: Infinity,
                }}
              >
                <Image src={"/assets/emoji_good.png"} width={150} height={150} alt="PlayButton" style={{ cursor: "pointer" }} />
              </motion.div>
              <motion.h4 style={{ textAlign: "center" }}>{props.releaseMessage}</motion.h4>
            </motion.div>
          </motion.div>
        </motion.div>
        {/* button controls */}
        <motion.div style={{ marginTop: "10px" }}>
          <motion.button
            className="btn btn-success btn-lg"
            onClick={() => {
              props.clickIgnore();
            }}
            style={{ margin: "0 10px" }}
          >
            Abaikan
            <br />
            Pembaharuan
          </motion.button>
          <motion.button
            className="btn btn-warning btn-lg"
            onClick={() => {
              props.clickUpdate();
            }}
            style={{ margin: "0 10px" }}
          >
            Perbaharui
            <br />
            Aplikasi
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
