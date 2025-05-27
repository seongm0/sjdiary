# [NX API](https://nx.dev/nx-api)

## Table of Contents

### [NX](https://nx.dev/nx-api/nx)

### [Workspace](https://nx.dev/nx-api/workspace)

### [Eslint](https://nx.dev/nx-api/eslint)

### [Jest](https://nx.dev/nx-api/jest)

### [JavaScript](https://nx.dev/nx-api/js)

### [NestJS](https://nx.dev/nx-api/nest)

```bash
# Generate a NestJS Library
pnpm nx g @nx/nest:lib {library_name} --directory {path} --dry-run
# e.g. yarn nx g @nx/nest:lib shared-nest-email --directory libs/shared/nest/email --dry-run
```

### [NodeJS](https://nx.dev/nx-api/node)

### [NuxtJS](https://nx.dev/nx-api/nuxt)

### [VueJS](https://nx.dev/nx-api/nuxt)
```bash
# Generate a VueJS Application
pnpm nx g @nx/vue:app {application_name} --directory {path} --dry-run
# e.g. pnpm nx g @nx/vue:app vue-admin --directory apps/vue-admin --dry-run

# Generate a VueJS Library
pnpm nx g @nx/vue:lib {library_name} --directory {path} --dry-run
# e.g. pnpm nx g @nx/vue:lib shared-vue-ui --directory libs/shared/vue/ui --dry-run
```
