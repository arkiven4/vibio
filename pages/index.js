import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import stylesCustom from "../styles/custom.module.css";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";

//TODO : Check is localStorage available in browser, Make User Allow speaker

export default function Index() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [isOnline, setOnline] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const AudioSoundRef = useRef();

  useEffect(() => {
    AudioSoundRef.current.play();
    setLoading(true);
    if (window.localStorage) {
      window.localStorage.setItem("recognitionServer", "http://127.0.0.1:3003/recognition");
    }
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
          router.push('/home')
        }, 2000);
      });
  }, []);

  return (
    <div className={(styles.container, stylesCustom.backgound_image)} style={{ backgroundImage: "url('/bg2.jpg')"}}>
      <Head>
        <title>Vibio</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <div className={stylesCustom.card}>
          {/* <button type="button" className="btn btn-primary">Warning</button> */}
          <h1 className={styles.title} style={{textAlign: 'center'}}>Memuat Vibio.....</h1>
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
      </main>
      
    </div>
  );
}
