function status(request, response) {
  response.status(200).send({ response: "Resposta do endpoint /status" });
}

export default status;