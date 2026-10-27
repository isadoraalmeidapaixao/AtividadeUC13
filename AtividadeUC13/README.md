# StudyFlow 📚

Um projeto educacional desenvolvido com **React Native** e **Expo** para ensinar alunos a criar um aplicativo mobile completo. O app aborda desde a navegação entre telas, componentização e gerenciamento de estado até **persistência de dados em banco embarcado (SQLite)** e conceitos avançados de **Programação Orientada a Objetos (POO)**.


## 📚 Sobre o Projeto

O **StudyFlow** foi estruturado como material didático para disciplinas de desenvolvimento mobile e banco de dados embarcado. Ele simula uma plataforma de acompanhamento de rotinas de estudo onde o aluno aprende na prática a evoluir uma aplicação local do zero.

### O que os alunos aprendem na prática:

* ✅ Criar e estruturar uma aplicação mobile com React Native e Expo SDK.
* ✅ Organizar a arquitetura em camadas (`components`, `screens`, `models`, `database`, `navigation`).
* ✅ Configurar a navegação por pilha utilizando o **React Navigation** (`Native Stack`).
* ✅ Gerenciar estados locais e feedbacks visuais na UI (`useState`, `useEffect`).
* ✅ Criar uma Splash Screen animada utilizando a API `Animated` do React Native.
* ✅ Aplicar **Programação Orientada a Objetos (POO)** com **Encapsulamento** (atributos privados `#email`, `#password`, getters e setters).
* ✅ Aplicar **Herança** e **Polimorfismo** na criação de modelos visuais (`CardModel`).
* ✅ Integrar e manipular um **Banco de Dados Embarcado (SQLite Local)** com `expo-sqlite`.
* ✅ Tratar exceções e erros de runtime (`try/catch`, validação de `UNIQUE constraint`).
* ✅ Implementar formulários de **Login** e **Cadastro (`RegisterScreen`)** integrados ao banco.


## 🚀 Tecnologias e Bibliotecas

* **React Native & Expo (SDK 57)** - Plataforma e framework para desenvolvimento mobile.
* **Expo SQLite (`expo-sqlite`)** - Banco de dados SQL embarcado e síncrono para armazenamento offline privado no dispositivo.
* **React Navigation (`@react-navigation/native` & `native-stack`)** - Gerenciamento de rotas e fluxo entre telas.
* **JavaScript (ES6+)** - Uso avançado de classes, atributos privados (`#`), métodos estáticos, herança (`extends`) e herança com `super()`.
* **react-native-safe-area-context** - Garantia de área segura em diferentes telas e entalhes de dispositivos.


## 📋 Funcionalidades do Aplicativo

### 🚀 1. Splash Screen

* Tela inicial de carregamento exibida ao abrir a aplicação.
* Utiliza `Animated` para aplicar efeitos sutis de opacidade e escala no logo `SF`.
* Inicializa o banco de dados SQLite (`initDatabase()`) e consulta os usuários cadastrados no terminal para depuração.
* Redireciona automaticamente para o Login usando `navigation.replace()`.

### 🔐 2. Autenticação Local (SQLite)

* Consulta a tabela `users` do SQLite local utilizando o método estático `User.authenticateLocal(email, password)`.
* Exibe mensagens amigáveis em caso de credenciais incorretas ou campos vazios.
* Transmite o objeto do usuário serializado (`user.toObject()`) para a tela principal (`HomeScreen`).

### 📝 3. Cadastro de Novos Usuários (`RegisterScreen`)

* Formulário com campos de **Nome**, **E-mail**, **Senha** e **Confirmação de Senha**.
* Valida na interface se as duas senhas fornecidas coincidem.
* Instancia a classe `User`, que executa validações rigorosas de e-mail e tamanho mínimo de senha via setters.
* Salva o novo registro na base de dados SQLite local chamando o método `saveLocal()`.
* Trata conflitos de e-mails duplicados (`UNIQUE constraint failed`) e exibe feedback nativo.

### 🏠 4. Tela Home & Cards Polimórficos

* Exibe uma saudação personalizada utilizando os dados retornados do banco local.
* **POO em Ação:** Renderiza os cards informativos (`TaskCardModel`, `TimeCardModel`, `GoalCardModel`) estendendo a superclasse abstrata `CardModel`.
* Permite iniciar e encerrar sessões de estudo alternando dinamicamente o estado global da tela.
* Botão de encerramento de sessão e opção de logout.


## 🛠️ Como Executar o Projeto

### 1. Clonar e instalar as dependências

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/studyflow.git

# Acesse a pasta do projeto
cd studyflow

# Instale as dependências
npm install

```

### 2. Garantir que as dependências do SQLite e Navegação estão ativas

```bash
npx expo install expo-sqlite @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context

```

### 3. Executar o servidor de desenvolvimento

```bash
# Executar no Expo com limpeza de cache (Recomendado)
npx expo start -c

```

---

## 📁 Estrutura do Projeto

```txt
StudyFlow/
├── App.js                         # Ponto de entrada (Inicializa o SQLite e a navegação)
├── index.js                       # Registro principal do Expo
├── app.json                       # Configurações do projeto Expo
├── package.json                   # Dependências e scripts
└── src/
    ├── components/
    │   ├── InfoCard.js            # Componente genérico que consome a POO de CardModel
    │   ├── InputField.js          # Campo de entrada de texto reutilizável
    │   └── PrimaryButton.js       # Botão padronizado do aplicativo
    ├── database/
    │   └── database.js            # Criação, inicialização e consultas diretas no SQLite (.db)
    ├── models/
    │   ├── CardModel.js           # Classe Abstrata Base + Subclasses (Polimorfismo e Herança)
    │   └── User.js                # Modelo encapsulado de Usuário (Validações + SQLite local)
    ├── navigation/
    │   └── AppRoutes.js           # Centralização e mapa de rotas (Splash, Login, Register, Home)
    ├── screens/
    │   ├── HomeScreen.js          # Painel do estudante e estatísticas
    │   ├── LoginScreen.js         # Tela de autenticação consultando o banco local
    │   ├── RegisterScreen.js      # Tela de criação de nova conta e inserção no banco
    │   └── SplashScreen.js        # Tela de carregamento com animação
    └── styles/
        └── colors.js              # Paleta de cores centralizada

```

---

## 🔍 Conceitos-Chave de POO e Banco Embarcado

### 1. Encapsulamento e Atributos Privados (`#`)

Atributos como e-mail e senha não podem ser alterados diretamente por código externo sem passar pelas regras dos setters:

```javascript
export class User {
  #email;
  #password;

  setEmail(email) {
    if (!email.includes('@')) throw new Error('E-mail inválido.');
    this.#email = email;
  }
}

```

### 2. Operações Síncronas no SQLite Embarcado (`expo-sqlite`)

Utilização de instruções preparadas síncronas para evitar *SQL Injection*:

```javascript
saveLocal() {
  const statement = db.prepareSync(
    'INSERT INTO users (name, email, password) VALUES ($name, $email, $password)'
  );
  return statement.executeSync({ $name: this.name, $email: this.#email, $password: this.#password });
}

```

### 3. Herança e Polimorfismo nos Cards Visuais

Subclasses personalizam o comportamento de exibição de dados sobrescrevendo o método `getFormattedValue()`:

```javascript
export class TimeCardModel extends CardModel {
  getFormattedValue() {
    return `${Math.floor(this.minutes / 60)}h`;
  }
}

```

---

## 👨‍🏫 Dicas para o Instrutor / Professor

Este projeto serve como uma sequência completa para aulas práticas de desenvolvimento mobile:

1. **Aula 1:** Fundamentos de React Native, componentes reutilizáveis e navegação basilar.
2. **Aula 2:** Validação de formulários e tratamento de erros com `try/catch`.
3. **Aula 3:** Introdução à Programação Orientada a Objetos em JavaScript (Classes, Encapsulamento e Herança).
4. **Aula 4:** Banco de Dados Embarcado — Criação de tabelas e consultas com `expo-sqlite`.
5. **Aula 5:** Integração completa do fluxo de **Cadastro** e **Autenticação Local**.

---

Projeto-base construído para demonstrar na prática a evolução de um aplicativo mobile completo: desde a construção da UI componentizada e navegação por pilhas, até a modelagem de domínio orientada a objetos e persistência de dados offline com SQLite local.