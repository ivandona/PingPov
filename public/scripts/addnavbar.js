document.getElementById("navbar").innerHTML =
'<nav class=\"navbar navbar-expand-lg navbar-dark bg-dark\"> '+   
'<div class=\"collapse navbar-collapse\" id=\"navbarSupportedContent\">'+
  '<ul class=\"navbar-nav mr-auto\">'+
    '<li>'+
    '<img src=\"/images/Logo_Ping_Pov.png\" alt=\"PingPov Logo\" width=\"70px\" height=\"70px\">'+
    '</li>'+
    '<li class=\"nav-item active\">'+
      '<a class=\"nav-link\" href=\"#\">Tornei<span class=\"sr-only\">(current)</span> </a>'+
    '</li>'+
    
    
    '<li class=\"nav-item active\">'+
      '<a class=\"nav-link\" href=\"#\">Prenotazioni Tavolo<span class=\"sr-only\">(current)</span> </a>'+
    '</li>'+


      
    '<li class=\"nav-item active\">'+
      '<a class=\"nav-link\" href=\"#\">Partite<span class=\"sr-only\">(current)</span> </a>'+
    '</li>'+


      
    '<li class=\"nav-item active\">'+
      '<a class=\"nav-link\" href=\"#\">Partite<span class=\"sr-only\">(current)</span> </a>'+
    '</li>'+

   '<form class=\"form-inline my-2 my-lg-0\">'+
    '<input class=\"form-control mr-sm-2\" type=\"search\" placeholder=\"Ricerca un utente...\" aria-label=\"Ricerca un utente...\">'+
    '<button class=\"btn btn-outline-success my-2 my-sm-0\" type=\"submit\">Ricerca</button>'+
  '</form>'+
  '</ul>'+
 
'</div>'+
'<div>'+
  '<ul class=\"navbar-nav mr-auto\">'+
  
  '<a>  </a> '+
    '<li class=\"nav-item active\">'+
    '<a class=\"nav-link\" href=\"/auth\">Logout<span class=\"sr-only\">(current)</span> </a> '+
 '</li>'+
 '<li>'+
    '<img src=\"<%= user.photos[0].value %>\" alt=\"profile pic\" width=\"70px\" height=\"70px\" style=\"border-radius: 50%;\">'+
 '</li>'+
    '<% } else{'+
      '%>'+
      '<li class=\"nav-item active\">'+
      '  <a class=\"nav-link\" href=\"#/auth\">Login<span class=\"sr-only\">(current)</span> </a>'+
      '</li>'+
      
    '<%}%>'+
  '</ul>'+
'</div>'+
'</nav>'