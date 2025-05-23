import 'dotenv/config'; // Carrega variáveis de ambiente do .env
import TelegramBot from 'node-telegram-bot-api';
import { getHistoryBlaze } from './blazeApi.js';
import { analyzeSequence } from './analyzeSequence.js';
import { saveSequences } from './db.js';
import { findMatchingSequence } from './matchingSequence.js';
import emitter from './websocket.js';
import c from 'chalk';

// Configuração do Bot do Telegram
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
  console.error(c.red('Erro: Variáveis de ambiente TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID não definidas.'));
  console.log(c.yellow('Crie um arquivo .env na raiz do projeto e adicione as variáveis. Veja .env.example.'));
  process.exit(1); // Encerra o script se as variáveis não estiverem definidas
}

const bot = new TelegramBot(token);

console.log(c.blue('Bot do Telegram inicializado. Aguardando eventos...'));

const rounds = {};

const colorsNumbered = {
  ['0']: '⚪️ Branco',
  ['1']: '🔴 Vermelho',
  ['2']: '⚫️ Preto',
};

const colorsNumberedInverted = {
  white: '0',
  red: '1',
  black: '2',
};

emitter.on('newRoll', async (data) => {
  try {
    const history = await getHistoryBlaze();
    const last = history.slice(-4);

    const sequencesResults = analyzeSequence(history);
    const allSequences = saveSequences(sequencesResults);

    const match = findMatchingSequence(last, allSequences);

    if (match) {
      const parsedLast = last.map((color) => colorsNumbered[color]);
      const prediction = colorsNumbered[match];

      console.log(`ULTIMAS 4 JOGADAS: ${c.cyan(parsedLast.join(' '))}`);
      console.log(`POSSIVEL PROXIMA JOGADA: ${c.green(prediction)}`);

      // Envia a previsão para o Telegram
      const message = `🚨 *Possível Entrada Identificada* 🚨\n\nÚltimas 4 jogadas: ${parsedLast.join(' ')}\n\n🎯 Previsão: *${prediction}*`;
      try {
        await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
        console.log(c.blue('Mensagem de previsão enviada para o Telegram.'));
      } catch (telegramError) {
        console.error(c.red('Erro ao enviar mensagem de previsão para o Telegram:'), telegramError.message);
      }

      rounds[data.id] = match;
    }
  } catch (error) {
    console.error(c.red('Erro no manipulador newRoll:'), error);
  }
});

emitter.on('rollComplete', async (data) => {
  const match = rounds[data.id];
  if (!match) return;

  const colorNumber = colorsNumberedInverted[data.color];
  const actualResult = colorsNumbered[colorNumber];
  const expectedResult = colorsNumbered[match];

  let resultMessage = '';

  if (colorNumber === match) {
    const successMsg = `${c.green('DEU BOM:')} ${c.cyan(data.color)}`;
    console.log(successMsg + '\n');
    resultMessage = `✅ *GREEN!* ✅\n\nResultado: ${actualResult}\nPrevisão: ${expectedResult}`; // Mensagem de sucesso
  } else {
    const failMsg = `${c.red('DEU RUIM:')} ${c.cyan(data.color)}`;
    console.log(failMsg + '\n');
    resultMessage = `❌ *RED!* ❌\n\nResultado: ${actualResult}\nPrevisão: ${expectedResult}`; // Mensagem de falha
  }

  // Envia o resultado para o Telegram
  try {
    await bot.sendMessage(chatId, resultMessage, { parse_mode: 'Markdown' });
    console.log(c.blue('Mensagem de resultado enviada para o Telegram.'));
  } catch (telegramError) {
    console.error(c.red('Erro ao enviar mensagem de resultado para o Telegram:'), telegramError.message);
  }

  delete rounds[data.id];
});

// Tratamento de erros do WebSocket para maior robustez
emitter.on('error', (error) => {
  console.error(c.red('Erro no EventEmitter (WebSocket?):'), error);
});

