// This is the "Offline page" service worker
// Check compatibility for the browser we're running this in
if ("serviceWorker" in navigator) {
  if (navigator.serviceWorker.controller) {
    console.log(
      "[PWA Builder] active service worker found, no need to register"
    );
  } else {
    // Register the service worker
    navigator.serviceWorker
      .register("sw.js", {
        scope: "./"
      })
      .then(function(reg) {
        console.log(
          "[PWA Builder] Service worker has been registered for scope: " +
            reg.scope
        );
      });
  }
}

// VARIAVEL GLOBAL
let dadosUsuario = {};

async function verificarLogado() {
  const requisicao = await fetch(`/usuarios/${localStorage.idUsuario}`, {
    headers: {
      Authorization: `Bearer ${
        localStorage.token ? localStorage.token : "semtoken"
      }`
    }
  });

  const usuario = await requisicao.json();

  // ["", "public", "pages", "login.html"]
  path = location.pathname.split("/");

  if (path[1] === "login.html" || path[1] === "registro.html") {
    if (usuario.id) return (location = "/suas-caronas.html");
    return;
  }

  if (!usuario.id) {
    return (location = "/login.html");
  }

  dadosUsuario = usuario;

  $("#nomeUsuario").text(dadosUsuario.nome);
  $("#emailUsuario").text(dadosUsuario.email);
}

verificarLogado();

async function realizarLogin(email, senha) {
  const dados = {
    email: email,
    senha: senha
  };

  const requisicao = await fetch("/sessoes", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dados)
  });

  return requisicao.json();
}

function definirValor(input, valor) {
  $(input)
    .val(valor)
    // Pega div geral do input
    .closest(".mdc-text-field")
    // Busca a div o outlined
    .find(".mdc-notched-outline")
    .addClass("mdc-notched-outline--notched")
    // Sobe o texto placeholder do input
    .find(".mdc-floating-label")
    .addClass("mdc-floating-label--float-above");
}

// Seleciona o botão de login
$("span:contains('Logout')")
  .parent()
  .click(() => {
    localStorage.clear();

    location = "/login.html";
  });
