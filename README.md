# Nima

This is a random Discord bot that a few friends and I use on our server.

## Usage

Configure the `.env` file:

    $ cp .env.example .env
    $ $EDITOR .env

To run the bot in production:

    $ npm i
    $ npm run build
    $ npm start

To run it in development:

    $ npm i
    $ npm run dev

## Contributing

### Linting

The project uses [Husky](https://github.com/typicode/husky) for pre-commit and pre-push hooks that lint the code.

To try to automatically fix all problems, run `npm run lint-fix`.

To manually lint the code, run `npm run lint`.

Please, don't commit or push code that doesn't pass the linter.
