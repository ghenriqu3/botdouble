# Bot Blaze com Notificações no Telegram

Este projeto monitora os resultados do jogo Double da Blaze e envia notificações para um bot do Telegram quando identifica possíveis padrões e confirma os resultados.

## Pré-requisitos

Antes de começar, certifique-se de ter o Node.js instalado em sua máquina. Você pode baixá-lo em [https://nodejs.org/](https://nodejs.org/). É recomendado usar a versão LTS mais recente.

## Instalação

1.  **Descompacte o Projeto:** Extraia o arquivo `.zip` que você recebeu para uma pasta de sua preferência no seu computador.

2.  **Acesse a Pasta do Projeto:** Abra o terminal ou prompt de comando e navegue até a pasta onde você extraiu os arquivos do projeto.

    ```bash
    cd caminho/para/a/pasta/blaze-telegram-bot
    ```

3.  **Crie o Arquivo de Configuração:** O projeto utiliza variáveis de ambiente para armazenar o token do seu bot do Telegram e o ID do chat para onde as mensagens serão enviadas. Existe um arquivo de exemplo chamado `.env.example`. Crie uma cópia deste arquivo e renomeie-a para `.env`.

    *   No Linux/macOS:
        ```bash
        cp .env.example .env
        ```
    *   No Windows (prompt de comando):
        ```cmd
        copy .env.example .env
        ```
    *   No Windows (PowerShell):
        ```powershell
        Copy-Item .env.example .env
        ```

4.  **Configure as Variáveis de Ambiente:** Abra o arquivo `.env` que você acabou de criar com um editor de texto e substitua `SEU_TOKEN_AQUI` pelo token do seu bot do Telegram e `SEU_CHAT_ID_AQUI` pelo ID do chat (pode ser seu ID de usuário ou o ID de um grupo).

    ```dotenv
    TELEGRAM_BOT_TOKEN=7667101135:AAFiCqFdEN29WZ6EPCPwwxyaYHQxalqRPZY
    TELEGRAM_CHAT_ID=968748255
    ```
    **Importante:** Mantenha seu token de bot seguro e não o compartilhe publicamente.

5.  **Instale as Dependências:** No terminal, dentro da pasta do projeto, execute o comando abaixo para instalar todas as bibliotecas necessárias que o projeto utiliza.

    ```bash
    npm install
    ```
    Este comando lerá o arquivo `package.json` e baixará as dependências listadas.

## Execução

Após concluir a instalação e configuração, você pode iniciar o bot com o seguinte comando no terminal, ainda dentro da pasta do projeto:

```bash
npm start
```

O bot começará a monitorar os resultados da Blaze. Você verá mensagens no console indicando a conexão e, quando um padrão for identificado, uma mensagem será enviada para o chat configurado no Telegram. Os resultados (Green ou Red) também serão enviados.

Para parar o bot, volte ao terminal onde ele está rodando e pressione `Ctrl + C`.

## Estrutura do Projeto

*   `src/`: Contém o código-fonte principal do bot.
    *   `index.js`: Ponto de entrada da aplicação, onde a lógica principal e a integração com o Telegram residem.
    *   `blazeApi.js`: Funções para interagir com a API HTTP da Blaze (histórico).
    *   `websocket.js`: Lógica para conectar e receber dados via WebSocket da Blaze.
    *   `analyzeSequence.js`: Função para analisar sequências de resultados.
    *   `matchingSequence.js`: Função para encontrar sequências correspondentes.
    *   `db.js`: Funções para salvar e carregar sequências de um arquivo JSON.
*   `assets/`: Contém arquivos de dados, como o histórico de sequências.
    *   `sequences.json`: Armazena os padrões de sequência identificados.
*   `.env`: Arquivo (criado por você) com as credenciais do Telegram (não incluído no controle de versão).
*   `.env.example`: Arquivo de exemplo para as variáveis de ambiente.
*   `package.json`: Define as dependências e scripts do projeto.
*   `package-lock.json`: Registra as versões exatas das dependências instaladas.
*   `README.md`: Este arquivo de documentação.

Se tiver alguma dúvida ou encontrar problemas, revise os passos de instalação e configuração.
