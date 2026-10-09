import React from "react";
import { motion } from "framer-motion";

const BackgroundWrapper = ({ imageUrl, children, className = "" }) => {
  return (
    <motion.div
      className={`bg-cover bg-center min-h-screen w-full ${className}`}
      style={{ backgroundImage: `url(${imageUrl})` }}
      initial={{ rotateY: 0, rotateX: 0 }}
      animate={{ rotateY: [0, 2, -2, 0], rotateX: [0, 1, -1, 0] }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="bg-white/45 w-full h-full">{children}</div>
    </motion.div>
  );
};

export default BackgroundWrapper;
