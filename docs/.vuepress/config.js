// const pluginConf = require('./config/pluginConf.js');
const navConf = require("./config/navConf.js");
const headConf = require("./config/headConf.js");
const sidebarConf = require("./config/sidebarConf");
const moment = require("moment");
moment.locale("zh-cn");

module.exports = {
  title: "Joe的文档",
  description: "Joe的文档, vuepress 文档",
  head: [
    ["link", { rel: "icon", href: "/logo.png" }],
    ["link", { name: "kewword", content: "Joe的文档，前端开发，全栈开发" }]
  ],
  head: headConf,
  themeConfig: {
    lastUpdated: "上次更新时间",
    // repo: 'shanyuhai123/documents',
    // docsBranch: 'master',
    editLinks: true,
    editLinkText: "编辑文档！",
    nav: navConf,
    sidebar: sidebarConf
  },
  evergreen: true,
  plugins: [
    [
      "@vuepress/last-updated",
      {
        transformer: timestamp => {
          return moment(timestamp).fromNow(
            "YYYY[年]M[月]D[日] [星期]dddd h:mm:ss a"
          );
        }
      },
      "@vuepress/active-header-links"
    ]
  ]
};
