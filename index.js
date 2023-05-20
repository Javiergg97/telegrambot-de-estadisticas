const {Telegraf} = require('telegraf');
const fetch = require('node-fetch');

// Token de acceso de tu bot
const token = '6242272310:AAE2-5JnLaLnXQbp_Ep8LNJEiKgIury7Jzw';
const api_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJodHRwczovL3N0ZWFtY29tbXVuaXR5LmNvbS9vcGVuaWQvaWQvNzY1NjExOTkxOTg1MzU5MzQiLCJ1bmlxdWVfbmFtZSI6IipBTExTVEFSKlJlcGVhdC5nZyoiLCJTdWJqZWN0IjoiMWU4ZGYxMzYtYzNiYS00YWM3LWIwZjEtMmNiNDQ2ZGFhZjNjIiwiU3RlYW1JZCI6IjEyMzgyNzAyMDYiLCJuYmYiOjE2ODI4NzYxOTQsImV4cCI6MTcxNDQxMjE5NCwiaWF0IjoxNjgyODc2MTk0LCJpc3MiOiJodHRwczovL2FwaS5zdHJhdHouY29tIn0.stJCSi74TPLRVUChrLG0TBMm0qnWQ54f1AER-eSsF7I'

// Crea un nuevo bot
const bot = new Telegraf(token);

// Maneja el comando /start
bot.start((ctx) => ctx.reply('¡Hola! '+ ctx.from.first_name + ' Envía un número de jugador para obtener información del jugador'));

// Maneja los mensajes de texto
bot.on('text', (ctx) => {
  const playerId = parseInt(ctx.message.text);

  if (ctx.message.text.length < 7 || ctx.message.text.length > 10) {
    ctx.reply('Por favor, introduzca un número de cuenta válido, es posible que el id que esta enviando no sea un id válido');
    return;
  }

  if (isNaN(playerId)) {
    ctx.reply('Por favor, introduzca un número válido como ID de usuario');
    return;
  }

  fetch(`https://api.stratz.com/api/v1/Player/${playerId}`, {
    headers: {
      'Authorization': `Bearer ${api_token}`
    } 
  })
  .then(response => response.json())
  .then(data => { 
    // Aquí puedes hacer lo que quieras con los datos del jugador
    const playerName = "Nombre de jugador: " + data.steamAccount.name;
    const playerId = "PlayerId: " + data.steamAccount.id;
    const playerSmurf = data.steamAccount.smurfFlag;
    const playerFeed = data.identity.feedLevel
    const medalla = data.ranks[0].rank;
    const matchAndWins = ("Partidas: " + data.matchCount + " Victorias: " + data.winCount + " Perdidas: " + (data.matchCount - data.winCount));
    const avatar = data.steamAccount.avatar;
   
    const medallas = {
      Heraldo1: 11, 
      Heraldo2: 12,
      Heraldo3: 13,
      Heraldo4: 14,
      Heraldo5: 15,
      Guardián1: 21,
      Guardián2: 22,
      Guardián3: 23,
      Guardián4: 24,
      Guardián5: 25,
      Cruzado1: 31,
      Cruzado2: 32,
      Cruzado3: 33,
      Cruzado4: 34,
      Cruzado5: 35,
      Arconte1: 41,
      Arconte2: 42,
      Arconte3: 43,
      Arconte4: 44,
      Arconte5: 45,
      Leyenda1: 51,
      Leyenda2: 52,
      Leyenda3: 53,
      Leyenda4: 54,
      Leyenda5: 55,
      Ancestro1: 61,
      Ancestro2: 62,
      Ancestro3: 63,
      Ancestro4: 64,
      Ancestro5: 65,
      Divino1: 71,
      Divino2: 72,
      Divino3: 73,
      Divino4: 74,
      Divino5: 75,
    };

    let medallaNombre;

    for (const [nombre, valor] of Object.entries(medallas)) {
      if (valor === medalla) {
        medallaNombre = nombre;
      }
    }

    let smurfMessage = "";
    if (playerSmurf === 0) {
      smurfMessage = "No has sido detectado como smurf";
    } else if (playerSmurf === 1) {
      smurfMessage = "Has sido detectado como jugador smurf";
    }

    let niveldefedeo = "";
    if(playerFeed === 0){
      niveldefedeo = "No eres un jugador feeder"
    } else if (playerFeed === 1){
      niveldefedeo = "Eres un jugador feeder"
    }
    console.log(avatar);
    console.log(playerName);
    console.log(playerId);
    console.log(matchAndWins);
    console.log(medallaNombre)
    console.log(niveldefedeo)
    
    // Envía la información del jugador al usuario
    ctx.replyWithPhoto({ url: avatar }, { caption: `
      ${playerName}
      ${playerId}
      ${matchAndWins}
      ${smurfMessage}
      ${niveldefedeo}
      Medalla: ${medallaNombre}
    `});
  })
  .catch(error => {
    console.log(error);
    ctx.reply('Ha ocurrido un error al obtener la información del jugador. Por favor, inténtelo de nuevo más tarde.');
  });
})

// Inicia el bot
bot.launch();




