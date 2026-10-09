import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

const Fade = ({ children }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default Fade;
