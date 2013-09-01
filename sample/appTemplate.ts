module sample { export var appTemplate = [
  "﻿<ul class=\"carousel-item-list\">\r\n",
  {
    "plugin": "standard-iterator",
    "params": ".",
    "blocks": [
      "\t<li class=\"carousel-item\">\r\n\t\t<img class=\"carousel-item-image\" src=\"/img/",
      {
        "plugin": "value",
        "params": "img"
      },
      "\" />\r\n\t\t<span class=\"carousel-item-heading\">",
      {
        "plugin": "value",
        "params": "heading"
      },
      "</span>\r\n\t</li>\r\n"
    ]
  },
  "</ul>"
];}
