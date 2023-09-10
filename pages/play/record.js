import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/legacy/image";
import styles from "../../styles/Home.module.css";
import axios, { post } from "axios";
import pcm from "../../public/js/pcm";

import React, { useState, useEffect, useRef } from "react";

let chunks = [];

export default function Record() {
  const router = useRouter();

  var [isRecordAvailable, SetIsRecordAvailable] = useState(false);
  var [mediaRecorder, SetImediaRecorder] = useState(null);
  var [recognizedData, SetrecognizedData] = useState({ prediction: "Empty, Start Recording", time_exec: 0 });

  const recordButtonRef = useRef();
  const recordAudioRef = useRef();

  useEffect(() => {
    if (navigator.mediaDevices.getUserMedia) {
      SetIsRecordAvailable(true);

      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then(onSuccess, onError);
    } else {
      SetIsRecordAvailable(false);
    }
  }, []);

  useEffect(() => {
    if (mediaRecorder !== null) {
      mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = ({ e }) => {
        console.log("data available after MediaRecorder.stop() called.");
        recordAudioRef.current.controls = true;

        const blob = new Blob(chunks, {
          type: "audio/mp3;",
        });

        blob.arrayBuffer().then((data) => {
          const audioContext = new AudioContext();
          audioContext.decodeAudioData(data, (audioBuffer) => {
            console.log(audioBuffer.numberOfChannels);
            var left = audioBuffer.getChannelData(0);
            const interleaved = new Float32Array(audioBuffer.length);
            for (let index = 0; index < left.length; index++) {
              interleaved[index] = left[index];
            }

            // get WAV file bytes and audio params of your audio source
            const wavBytes = getWavBytes(interleaved.buffer, {
              isFloat: true, // floating point or 16-bit integer
              numChannels: 1,
              sampleRate: 48000,
            });

            const wav = new Blob([wavBytes], { type: "audio/wav" });
            console.log(wav);

            const formData = new FormData();
            formData.append("file_audio", wav);

            fetch("http://127.0.0.1:5000/recognition", {
              method: "POST", // *GET, POST, PUT, DELETE, etc.
              cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => SetrecognizedData(data))
              .catch((error) => {
                console.log("Error ========>", error);
              });
          });
        });

        // chunks[0].arrayBuffer().then((data) => {
        //   console.log(data);
        //   let dataview = encodeWAV(data);
        //   let audioBlob = new Blob([dataview], { type: "audio/wav" });
        //   console.log(audioBlob);
        // });

        // // const blob = new Blob(chunks, {
        // //   type: "audio/wav; codecs=MS_PCM",
        // // });

        // let fileReader = new FileReader();
        // let arrayBuffer;

        // fileReader.onloadend = () => {
        //   arrayBuffer = fileReader.result;
        // };

        // //fileReader.readAsDataURL(superBlob);

        // chunks = [];
        // const audioURL = window.URL.createObjectURL(blob);
        // recordAudioRef.current.src = audioURL;

        // let file = new File([blob], "Lohe" + ".wav", {
        //   type: "audio/wav",
        //   lastModified: new Date().getTime(),
        // });

        // console.log(file);

        // recordAudioRef.current.style.display = "";

        // const formData = new FormData();
        // formData.append("file_audio", file);

        // fetch("http://127.0.0.1:5000/recognition", {
        //   method: "POST", // *GET, POST, PUT, DELETE, etc.
        //   cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        //   body: formData,
        // })
        //   .then((response) => response.json())
        //   .then((data) => SetrecognizedData(data))
        //   .catch((error) => {
        //     console.log("Error ========>", error);
        //   });
      };
    }
  }, [mediaRecorder]);

  let onSuccess = function (stream) {
    SetImediaRecorder(new MediaRecorder(stream));
  };

  let onError = function (err) {
    console.log("The following error occured: " + err);
  };

  const start_record = () => {
    console.log("recorder started");
    mediaRecorder.start();
    recordButtonRef.current.innerText = "Recording...";
    recordButtonRef.current.disabled = true;

    setTimeout(() => {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
      recordButtonRef.current.removeAttribute("disabled");
      recordButtonRef.current.innerText = "Record";
    }, 4000);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Vibio</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <div className={""}>
          {isRecordAvailable ? (
            <div align={"center"}>
              <button ref={recordButtonRef} onClick={start_record} id="record-button" className={"btn btn-primary"} style={{ margin: 10 }}>
                Record
              </button>
              <br></br>
              <audio ref={recordAudioRef} style={{ display: "" }} id="audio_preview_upload" controls={""} src={""}></audio>
              <br />
              <p>{recognizedData.prediction}</p>
              <p>Time : {recognizedData.time_exec}</p>
            </div>
          ) : (
            <p>Record Sound is not Available</p>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

// Returns Uint8Array of WAV bytes
function getWavBytes(buffer, options) {
  const type = options.isFloat ? Float32Array : Uint16Array;
  const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT;

  const headerBytes = getWavHeader(Object.assign({}, options, { numFrames }));
  const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength);

  // prepend header, then add pcmBytes
  wavBytes.set(headerBytes, 0);
  wavBytes.set(new Uint8Array(buffer), headerBytes.length);

  return wavBytes;
}

// adapted from https://gist.github.com/also/900023
// returns Uint8Array of WAV header bytes
function getWavHeader(options) {
  const numFrames = options.numFrames;
  const numChannels = options.numChannels || 2;
  const sampleRate = options.sampleRate || 44100;
  const bytesPerSample = options.isFloat ? 4 : 2;
  const format = options.isFloat ? 3 : 1;

  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numFrames * blockAlign;

  const buffer = new ArrayBuffer(44);
  const dv = new DataView(buffer);

  let p = 0;

  function writeString(s) {
    for (let i = 0; i < s.length; i++) {
      dv.setUint8(p + i, s.charCodeAt(i));
    }
    p += s.length;
  }

  function writeUint32(d) {
    dv.setUint32(p, d, true);
    p += 4;
  }

  function writeUint16(d) {
    dv.setUint16(p, d, true);
    p += 2;
  }

  writeString("RIFF"); // ChunkID
  writeUint32(dataSize + 36); // ChunkSize
  writeString("WAVE"); // Format
  writeString("fmt "); // Subchunk1ID
  writeUint32(16); // Subchunk1Size
  writeUint16(format); // AudioFormat https://i.stack.imgur.com/BuSmb.png
  writeUint16(numChannels); // NumChannels
  writeUint32(sampleRate); // SampleRate
  writeUint32(byteRate); // ByteRate
  writeUint16(blockAlign); // BlockAlign
  writeUint16(bytesPerSample * 8); // BitsPerSample
  writeString("data"); // Subchunk2ID
  writeUint32(dataSize); // Subchunk2Size

  return new Uint8Array(buffer);
}
