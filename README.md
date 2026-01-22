# Vacina Digital

## Descrição do Projeto

Vacina Digital é uma aplicação web desenvolvida para digitalizar e gerenciar cadernetas de vacinação. O sistema permite que os usuários enviem fotos de suas cadernetas de vacinação físicas e utilize inteligência artificial para extrair automaticamente as informações de vacinação, como nome do paciente, datas de vacinação, nomes das vacinas, doses e lotes.

## Propósito

O objetivo principal deste projeto é facilitar o acesso e armazenamento digital de informações de vacinação, especialmente em um contexto onde muitas pessoas ainda mantêm suas informações em cadernetas físicas. Isso ajuda na organização pessoal, facilita consultas médicas e pode ser útil em situações onde a documentação física não está disponível.

## Tecnologias Utilizadas

### Frontend
- **React 18**: Biblioteca JavaScript para construção de interfaces de usuário
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática
- **Vite**: Ferramenta de build rápida para projetos web modernos
- **Tailwind CSS**: Framework CSS utilitário para estilização
- **Shadcn UI**: Coleção de componentes acessíveis e customizáveis
- **Lucide React**: Biblioteca de ícones SVG simples e consistentes

### Backend e Infraestrutura
- **Supabase**: Plataforma de banco de dados PostgreSQL com autenticação e funções de borda
- **Edge Functions**: Funções serverless para processamento de imagens e extração de dados
- **API de IA**: Integração com provedores de inteligência artificial (como OpenAI) para extração automática de dados de vacinação

### Gerenciamento de Estado e Utilitários
- **TanStack Query (React Query)**: Gerenciamento de cache e sincronização de dados assíncronos
- **React Hook Form**: Gerenciamento de formulários com validação
- **Zod**: Validação de esquemas em tempo de execução
- **html2canvas**: Conversão de elementos DOM em imagens
- **React Router DOM**: Roteamento de páginas

## Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis da UI
│   ├── ui/              # Componentes da biblioteca Shadcn
│   ├── Header.tsx       # Cabeçalho da aplicação
│   ├── UploadArea.tsx   # Área para upload de imagens
│   ├── PatientForm.tsx  # Formulário de edição de paciente
│   ├── VaccinationTable.tsx # Tabela de vacinação
│   └── DocumentPreview.tsx # Visualização do documento final
├── hooks/               # Hooks personalizados
│   └── useVaccinationExtractor.ts # Lógica principal de extração
├── integrations/        # Integrações com serviços externos
│   └── supabase/        # Cliente e tipos do Supabase
├── pages/               # Páginas da aplicação
│   ├── Index.tsx        # Página principal
│   └── NotFound.tsx     # Página 404
├── types/               # Definições de tipos TypeScript
│   └── vaccination.ts   # Tipos relacionados à vacinação
├── lib/                 # Utilitários e funções auxiliares
│   └── utils.ts         # Funções utilitárias
├── App.tsx              # Componente raiz da aplicação
├── main.tsx             # Ponto de entrada da aplicação
└── index.css            # Estilos globais
```

## Funcionamento

### Fluxo Principal

1. **Upload**: O usuário faz upload de uma foto da caderneta de vacinação
2. **Extração**: A imagem é enviada para uma função de borda no Supabase que utiliza IA para extrair os dados
3. **Edição**: Os dados extraídos são apresentados para revisão e edição pelo usuário
4. **Visualização**: O usuário pode visualizar o documento digital final
5. **Exportação**: O documento pode ser baixado como imagem ou impresso

### Funcionalidades

- **Upload de Imagens**: Interface intuitiva para envio de fotos de cadernetas
- **Extração Automática**: Extração de dados usando inteligência artificial
- **Edição de Dados**: Formulários para correção e atualização das informações
- **Visualização de Documento**: Prévia do documento final no formato oficial
- **Exportação**: Download como PNG ou impressão do documento
- **Design Responsivo**: Funciona em dispositivos móveis e desktop

### Componentes Principais

- **UploadArea**: Área para arrastar e soltar ou selecionar imagens
- **PatientForm**: Formulário para edição de informações do paciente
- **VaccinationTable**: Tabela interativa para gerenciar registros de vacinação
- **DocumentPreview**: Visualização do documento final no formato oficial
- **useVaccinationExtractor**: Hook personalizado que gerencia todo o fluxo de extração e edição

## Configuração e Execução

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Docker (opcional, para execução em contêineres)

### Instalação

1. Clone o repositório:
```bash
git clone <URL_DO_REPOSITORIO>
cd vacina-digital
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:8080`

### Execução com Docker

Para executar a aplicação usando Docker:

```bash
# Construir e rodar o ambiente de desenvolvimento
docker-compose up dev

# Ou rodar a versão de produção
docker-compose up app
```

## Variáveis de Ambiente

- `VITE_SUPABASE_URL`: URL do seu projeto Supabase
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Chave pública do Supabase
- `VITE_SUPABASE_PROJECT_ID`: ID do projeto Supabase
- `OPENAI_API_KEY`: Chave de API para o serviço de inteligência artificial (no servidor Supabase)

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Compila a aplicação para produção
- `npm run preview`: Visualiza a versão de produção localmente
- `npm run lint`: Executa o linter
- `npm run test`: Executa os testes unitários

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NomeDaFeature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona NomeDaFeature'`)
4. Faça push para a branch (`git push origin feature/NomeDaFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## Contato

Projeto desenvolvido para fins de demonstração e aprendizado.
