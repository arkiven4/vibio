import Image from "next/image";
import { motion } from "framer-motion";

import stylesCustom from "../styles/custom.module.css";


const ModalReactionQuiz = (props) => {
  var imageShowsrc = props.isCorrect ? "/assets/emoji_good.png" : "/assets/emoji_bad.png";
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
        {props.isCorrect ? (
          <motion.h3 className={`${stylesCustom.mini_card_popupRW}`} style={{ color: "green" }}>
            Benar
          </motion.h3>
        ) : (
          <motion.h3 className={`${stylesCustom.mini_card_popupRW}`} style={{ color: "red" }}>
            Salah
          </motion.h3>
        )}
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
                <Image src={imageShowsrc} width={300} height={300} alt="PlayButton" style={{ cursor: "pointer" }} />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
        {/* button controls */}
        <motion.div style={{ marginTop: "10px" }}>
          <motion.button
            className="btn btn-primary"
            onClick={() => {
              props.clickFunction();
            }}
          >
            Soal Selanjutnya
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

module.exports = {
  ModalReactionQuiz,
};
