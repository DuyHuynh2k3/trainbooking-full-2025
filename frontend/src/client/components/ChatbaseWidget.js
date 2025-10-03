// components/ChatbaseWidget.js
import React, { useEffect } from "react";

const ChatbaseWidget = () => {
  useEffect(() => {
    // Kiểm tra xem script đã được tải chưa để tránh tải nhiều lần
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
      const script = document.createElement("script");
      script.innerHTML = `
        (function(){
          if(!window.chatbase||window.chatbase("getState")!=="initialized"){
            window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};
            window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})
          }
          const onLoad=function(){
            const script=document.createElement("script");
            script.src="https://www.chatbase.co/embed.min.js";
            script.id="6s_ihXWDhNH_Cu4jGMeEG";
            script.domain="www.chatbase.co";
            document.body.appendChild(script)
          };
          if(document.readyState==="complete"){onLoad()}
          else{window.addEventListener("load",onLoad)}
        })();
      `;
      document.body.appendChild(script);

      // Cleanup: Xóa script khi component unmount
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  return null; // Component không render giao diện
};

export default ChatbaseWidget;
