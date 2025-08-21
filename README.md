# Manual do Jovem

O Manual do Jovem é uma plataforma web desenvolvida para auxiliar jovens em seu desenvolvimento, oferecendo um espaço para ler e compartilhar artigos sobre três pilares essenciais: carreira profissional, gestão financeira e desenvolvimento pessoal.

## ✨ Funcionalidades

* **Autenticação de Usuários:** Sistema completo de cadastro e login.
* **Gerenciamento de Perfil:** Os usuários podem editar suas informações, incluindo nome, e-mail e foto de perfil.
* **Artigos por Categoria:** Navegue por artigos nas seções Profissional, Financeira e Pessoal.
* **Criação de Conteúdo:** Usuários autenticados podem criar, editar e excluir seus próprios artigos.
* **Interação:** Sistema de comentários nos artigos para promover a discussão e troca de experiências.
* **Contato:** Formulário para envio de dúvidas e feedback por e-mail.

## 🚀 Tecnologias Utilizadas

### Backend
* **Node.js**
* **Express.js:** Framework para a construção da API REST.
* **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
* **TypeORM:** ORM para interação com o banco de dados.
* **MySQL (Desenvolvimento) / PostgreSQL (Produção):** Bancos de dados relacionais.
* **JWT (JSON Web Tokens):** Para autenticação e gerenciamento de sessões.
* **Bcrypt.js:** Para hashing de senhas.
* **Nodemailer:** Para o serviço de envio de e-mails.

### Frontend
* **HTML5**
* **CSS3**
* **JavaScript (ES6+)**
* **Bootstrap:** Framework CSS para estilização e responsividade.

## 📋 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:
* [Node.js](https://nodejs.org/en/)
* [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
* Um gerenciador de banco de dados (MySQL/PostgreSQL).

## ⚙️ Instalação e Execução

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/eduardoxxmenezes/manualdojovem-oficial.git](https://github.com/eduardoxxmenezes/manualdojovem-oficial.git)
    ```

2.  **Navegue até o diretório do projeto:**
    ```bash
    cd manualdojovem-oficial
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Configure as variáveis de ambiente:**
    * Crie um arquivo `.env` na raiz do projeto, utilizando o `.env.example` (se disponível) como base.
    * Preencha com as credenciais do seu banco de dados e outras chaves necessárias:
    ```env
    # Configuração do Banco de Dados (Exemplo para MySQL)
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=seu_usuario
    DB_PASSWORD=sua_senha
    DB_NAME=manual_do_jovem

    # Chave Secreta para JWT
    JWT_SECRET=sua_chave_secreta

    # Credenciais para envio de e-mail (Nodemailer)
    EMAIL_USER=seu_email@gmail.com
    EMAIL_PASS=sua_senha_de_app_do_gmail
    ```

5.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O servidor será iniciado em `http://localhost:3000`.

## 📜 Scripts Disponíveis

* `npm run dev`: Inicia o servidor em modo de desenvolvimento com `ts-node-dev`.
* `npm run build`: Compila o código TypeScript para JavaScript no diretório `/dist`.
* `npm start`: Inicia o servidor em modo de produção a partir dos arquivos compilados.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.