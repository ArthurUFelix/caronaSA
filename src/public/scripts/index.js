async function verificarLogado() {
  const requisicao = await fetch("/usuarios/1", {
    headers: {
      Authorization: `Bearer ${localStorage.token}`
    }
  });

  // ["", "public", "pages", "login.html"]
  path = location.pathname.split("/");

  if (path[3] === "login.html" || path[3] === "registro.html") {
    if (requisicao.status === 200)
      return (location = "/public/pages/criar-carona.html");
    return;
  }

  if (requisicao.status !== 200) {
    return (location = "/public/pages/login.html");
  }
}

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
