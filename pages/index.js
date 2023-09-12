import Head from "next/head";
import Image from "next/legacy/image";
import styles from "../styles/Home.module.css";
import stylesCustom from "../styles/custom.module.css";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { Preferences } from "@capacitor/preferences";

import axios, { post } from "axios";

//TODO : Check is localStorage available in browser, Make User Allow speaker

export default function Index() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [isOnline, setOnline] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [statusSendData, setStatusSendData] = useState([]);
  const [currentBuffer, setCurrentBuffer] = useState({});
  const [lengthBuffered, setLengthBuffered] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [progressMessage, setProgressMessage] = useState("Cek Koneksi");

  const AudioSoundRef = useRef();

  useEffect(() => {
    AudioSoundRef.current.play();
    AudioSoundRef.current.volume = 0.5;
    AudioSoundRef.current.volume = 0.5;
    setLoading(true);

    Preferences.get({ key: "user_uuid" }).then((ret) => {
      if (ret.value == null) {
        router.push("/login");
      } else {
        fetch("https://google.com/", {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          mode: "no-cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            setProgressValue(20);
            setProgressMessage("Mengunggah Data Terapi");
            Preferences.get({ key: "buffered_sendedData" }).then((ret) => {
              if (ret.value != null) {
                let buffered_data = JSON.parse(ret.value);
                let length_entries = Object.keys(buffered_data).length;

                setCurrentBuffer(buffered_data);
                setLengthBuffered(length_entries);

                if (length_entries > 0) {
                  setProgressValue(20 + (60 / length_entries) * 1);
                  setProgressMessage(`Menggugah Data Terapi ${0}/${length_entries}`);
                  sendBuffered_Data(buffered_data, length_entries);
                }

                // add Data
                // let list_entries = Object.keys(buffered_data);
                // console.log(buffered_data);
                // console.log(list_entries.length);

                // buffered_data[list_entries.length] = {
                //   json_data: JSON.stringify({
                //     kategori: "buah",
                //     jumlah_benar: 7,
                //     jumlah_salah: 3,
                //     timestamp: Date.now(),
                //   }),
                //   tipe_terapi: 1
                // }

                // console.log(buffered_data)
                // Preferences.set({
                //   key: "buffered_sendedData",
                //   value: JSON.stringify(buffered_data),
                // });
              }
            });

            setOnline(true);
          })
          .catch((e) => {
            // console.log(e.message);
            // alert(e.message);
            setOnline(false);
            setTimeout(() => {
              router.push("/home");
            }, 2000);
          });
      }
    });
  }, []);

  useEffect(() => {
    if (lengthBuffered > 0) {
      if (lengthBuffered == statusSendData.length) {
        for (let index = 0; index < statusSendData.length; index++) {
          if (statusSendData[index].status == "success") {
            delete currentBuffer[statusSendData[index].key];
          }
        }
        Preferences.set({
          key: "buffered_sendedData",
          value: JSON.stringify(currentBuffer),
        }).then(() => {
          setTimeout(() => {
            router.push("/home");
          }, 2000);
        });
        console.log("Done Upload");
      }
    } else {
            
      setProgressValue(80);
      Preferences.get({ key: "user_uuid" }).then((ret) => {
        if (ret.value == null) {
          router.push("/login");
        } else {
          setTimeout(() => {
            router.push("/home");
          }, 2000);
        }
      })
    }
  }, [statusSendData]);

  async function sendBuffered_Data(buffered_datas, length_entries) {
    return new Promise((resolve, reject) => {
      Preferences.get({ key: "user_uuid" })
        .then((ret) => {
          for (const key in buffered_datas) {
            var current_buffer = buffered_datas[key];
            var formData = new FormData();
            formData.append("json_data", current_buffer.json_data);
            formData.append("tipe_terapi", current_buffer.tipe_terapi);

            postData(ret.value, formData, buffered_datas, key)
              .then((result) => {
                if (result == "success") {
                  statusSendData.push({
                    key: key,
                    status: "success",
                  });
                } else {
                  statusSendData.push({
                    key: key,
                    status: "failed",
                  });
                }
              })
              .finally(() => {
                setProgressValue(20 + (60 / length_entries) * (1 + parseInt(key)));
                setProgressMessage(`Menggugah Data Terapi ${parseInt(key) + 1}/${length_entries}`);
              });
          }
        })
        .finally(() => {
          resolve("OK");
        });
    });
  }

  async function postData(user_uuid, formData) {
    return new Promise((resolve, reject) => {
      post("https://elbicare.my.id/api/vibio/insert_terapi/" + user_uuid, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
        .then((response) => {
          console.log(response.data);
          if (response.data.status == "success") {
            resolve("success");
          }
        })
        .catch((error) => {
          console.log("Error ========>", error);
        });
    });
  }

  return (
    <div className={(styles.container, stylesCustom.backgound_image)} style={{ backgroundImage: "linear-gradient(rgba(36, 36, 36, 0.40), rgba(36, 36, 36, 0.40)), url('/bg2.jpg')" }}>
      <Head>
        <title>Vibio</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <div className={stylesCustom.card}>
          {/* <button type="button" className="btn btn-primary">Warning</button> */}
          <p className={styles.title} style={{ textAlign: "center", fontSize: "6vh" }}>
            Memuat Vibio.....
          </p>
          <br></br>

          <div className="progress" style={{ width: "75%" }}>
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              aria-valuenow={progressValue}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{ width: progressValue + "%" }}
            >
              {progressValue}%
            </div>
          </div>
          <br></br>
          <h3 style={{ textAlign: "center"}}>{progressMessage}.....</h3>
          <br></br>
          {/* {isOnline ? <h3 style={{ color: "green" }}>Online</h3> : <h3 style={{ color: "red" }}>Offline Mode</h3>} */}
        </div>
        <audio ref={AudioSoundRef} controls loop autoPlay src={"/assets/music/bg-music1.wav"} style={{ display: "none" }}></audio>
      </main>
    </div>
  );
}
