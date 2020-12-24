FROM cypress/included:6.1.0
USER node
RUN mkdir /home/node/src

COPY --chown=node:node cypress /home/node/src/cypress
COPY --chown=node:node cypress.json /home/node/src/cypress.json
COPY --chown=node:node package.json /home/node/src/package.json
COPY --chown=node:node reporter-config.json /home/node/src/reporter-config.json
COPY --chown=node:node node_modules /home/node/src/node_modules
WORKDIR /home/node/src

CMD ["--spec", "**/pushgateway.spec.js"]


