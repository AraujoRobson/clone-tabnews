function Home() {
  const experiencias = [
    {
      cargo: "Desenvolvedor Full Stack",
      empresa: "Sysmo Sistemas Ltda",
      periodo: "nov. 2023 – presente",
      itens: [
        "Desenvolvimento full stack em sistema completo para redes de franquias — Java/Quarkus, Angular e Flutter.",
        "Equipe de ~10 pessoas, metodologia Scrum, atuando do levantamento de requisitos à entrega.",
        "Padronizei o uso de IA no time desenhando o fluxo de agentes e centralizando as regras para todos os projetos (microsserviços back-end, microfrontends Angular e app Flutter).",
        "Desenvolvi microsserviço de notificações em tempo real via SSE, centralizando alertas de processos críticos para múltiplos serviços.",
        "Implementei geração de relatórios complexos com JasperReports (rastreabilidade de preços, etiquetas, documentos fiscais por CFOP) e criei treinamento interno que padronizou o uso da ferramenta.",
        "Colaboro com o time mobile na evolução do app em Flutter, expandindo o ecossistema do sistema web para a experiência móvel de gestão.",
        "Refatorei manutenção de preços com paginação e autosave por evento de blur, eliminando travamentos e prevenindo perda de dados.",
        "Construí fluxo completo de pedidos de compra no Angular com múltiplas etapas (nz-steps/ng-Zorro) e registro parcial por fase.",
        "Liderei desenvolvimento full stack do sistema de fidelização: APIs Java para acúmulo/resgate de pontos e interfaces no Angular.",
      ],
    },
    {
      cargo: "Gerente de Suporte e Atendimento ao Cliente",
      empresa: "Ammes Informática",
      periodo: "jan. 2022 – nov. 2023",
      itens: [
        "Gestão do time de suporte, atendimento a clientes e treinamento em sistemas de gestão empresarial (ERP).",
        "Operação constante em banco de dados SQL: scripts de migração, correção e manutenção de dados.",
      ],
    },
    {
      cargo: "Técnico de Tecnologia da Informação",
      empresa: "Ammes Informática",
      periodo: "abr. 2014 – dez. 2021",
      itens: [
        "Suporte técnico a sistemas ERP, infraestrutura Windows e ambientes de rede.",
        "Treinamento de clientes, migração de banco de dados e diagnóstico de falhas em sistemas críticos.",
      ],
    },
  ];

  const formacoes = [
    {
      titulo: "Senioridade em Desenvolvimento",
      instituicao: "curso.dev (Filipe Deschamps)",
      status: "Em andamento",
    },
    {
      titulo: "Full Cycle Tech Week - IA for Devs",
      instituicao: "Curso Livre",
      status: "2026",
    },
    {
      titulo: "Formação de Desenvolvedores (DEV-TI)",
      instituicao: "UNOESC",
      status: "Concluído (2024)",
    },
    {
      titulo: "Análise e Desenvolvimento de Sistemas",
      instituicao: "UNIP",
      status: "Incompleto",
    },
    {
      titulo: "Gestão da Tecnologia da Informação",
      instituicao: "UCEFF",
      status: "Incompleto",
    },
  ];

  const competencias = [
    {
      categoria: "Back-end",
      itens: ["Java", "Quarkus", "REST APIs", "SSE", "JasperReports", "JUnit"],
    },
    {
      categoria: "Front-end",
      itens: [
        "Angular",
        "TypeScript",
        "JavaScript",
        "ng-Zorro",
        "HTML",
        "SCSS/CSS",
      ],
    },
    { categoria: "Mobile", itens: ["Flutter"] },
    { categoria: "Banco de dados", itens: ["PostgreSQL", "SQL"] },
    {
      categoria: "DevOps / Versionamento",
      itens: ["Git", "GitLab", "GitLab CI/CD", "Microsserviços"],
    },
    {
      categoria: "Metodologia",
      itens: ["Scrum", "Revisão de código", "Padronização com IA"],
    },
  ];

  return (
    <main>
      <header className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-eyebrow">Full Stack Developer</p>
            <h1 className="hero-name">Robson Araújo</h1>
            <p className="hero-stack">
              Java · Quarkus · Angular · Flutter · TypeScript · PostgreSQL ·
              Microsserviços
            </p>
            <p className="hero-summary">
              Desenvolvedor Full Stack com foco em back-end Java/Quarkus,
              front-end Angular e mobile Flutter, atuando no desenvolvimento de
              um sistema completo para redes de franquias. Antes de migrar para
              desenvolvimento, foram 8 anos com suporte técnico e ERP — uma
              visão de produto diferenciada de quem entende como os sistemas são
              usados na prática.
            </p>
            <div className="hero-contact">
              <a href="mailto:roobson.araujo02@gmail.com">
                roobson.araujo02@gmail.com
              </a>
              <span className="dot">·</span>
              <a
                href="https://wa.me/5549999630919"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir conversa no WhatsApp"
              >
                +55 (49) 99963-0919
              </a>
              <span className="dot">·</span>
              <span>SMOeste, SC — Brasil</span>
            </div>
          </div>
          <div className="hero-avatar">
            <img src="/avatar.png" alt="Foto de Robson Araújo" />
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Experiência profissional</h2>
          <div className="timeline">
            {experiencias.map((exp) => (
              <article key={exp.cargo + exp.empresa} className="exp-card">
                <header className="exp-header">
                  <h3 className="exp-cargo">{exp.cargo}</h3>
                  <p className="exp-meta">
                    <span className="exp-empresa">{exp.empresa}</span>
                    <span className="exp-periodo">{exp.periodo}</span>
                  </p>
                </header>
                <ul className="exp-itens">
                  {exp.itens.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Competências técnicas</h2>
          <div className="skills-grid">
            {competencias.map((c) => (
              <div key={c.categoria} className="skill-card">
                <h3 className="skill-categoria">{c.categoria}</h3>
                <div className="skill-tags">
                  {c.itens.map((item) => (
                    <span key={item} className="tag">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Formação e cursos</h2>
          <ul className="formacao-list">
            {formacoes.map((f) => (
              <li key={f.titulo} className="formacao-item">
                <div>
                  <p className="formacao-titulo">{f.titulo}</p>
                  <p className="formacao-instituicao">{f.instituicao}</p>
                </div>
                <span className="formacao-status">{f.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-content">
          <p>Vamos conversar?</p>
          <a
            className="footer-cta"
            href="https://wa.me/5549999630919"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir conversa no WhatsApp"
          >
            <svg
              className="whatsapp-icon"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                fill="#fff"
                d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"
              ></path>
              <path
                fill="#fff"
                d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"
              ></path>
              <path
                fill="#cfd8dc"
                d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"
              ></path>
              <path
                fill="#40c351"
                d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"
              ></path>
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
        </div>
      </footer>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }
        html,
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, sans-serif;
          background: #0b1020;
          color: #e6e9f2;
          line-height: 1.6;
        }
        a {
          color: #4fd1c5;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      `}</style>

      <style jsx>{`
        .container {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .hero {
          background: radial-gradient(
              circle at 20% 0%,
              rgba(79, 209, 197, 0.18),
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 20%,
              rgba(99, 102, 241, 0.18),
              transparent 55%
            ),
            #0b1020;
          padding: 96px 0 80px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .hero-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 48px;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 48px 0 64px;
        }
        .hero-text {
          flex: 1;
          min-width: 0;
          max-width: 760px;
        }
        .hero-avatar {
          flex-shrink: 0;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          padding: 6px;
          background: linear-gradient(135deg, #4fd1c5 0%, #6366f1 100%);
          box-shadow: 0 24px 60px rgba(79, 209, 197, 0.25);
        }
        .hero-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          display: block;
          border: 4px solid #0b1020;
        }
        .hero-eyebrow {
          text-transform: uppercase;
          letter-spacing: 4px;
          font-size: 13px;
          color: #4fd1c5;
          margin: 0 0 16px;
          font-weight: 600;
        }
        .hero-name {
          font-size: clamp(40px, 6vw, 60px);
          margin: 0 0 16px;
          font-weight: 800;
          letter-spacing: -1px;
          background: linear-gradient(120deg, #e6e9f2 0%, #4fd1c5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-stack {
          font-size: 16px;
          color: #a5acc0;
          margin: 0 0 28px;
        }
        .hero-summary {
          margin: 0 0 32px;
          font-size: 17px;
          color: #c7cddc;
        }
        .hero-contact {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 15px;
          color: #a5acc0;
        }
        .dot {
          opacity: 0.5;
        }

        .section {
          padding: 72px 0;
        }
        .section-alt {
          background: #0e1530;
        }
        .section-title {
          font-size: 28px;
          margin: 0 0 40px;
          font-weight: 700;
          position: relative;
          padding-left: 16px;
        }
        .section-title::before {
          content: "";
          position: absolute;
          left: 0;
          top: 8px;
          bottom: 8px;
          width: 4px;
          border-radius: 4px;
          background: linear-gradient(180deg, #4fd1c5, #6366f1);
        }

        .timeline {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .exp-card {
          background: #121935;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 24px 28px;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease;
        }
        .exp-card:hover {
          transform: translateY(-2px);
          border-color: rgba(79, 209, 197, 0.4);
        }
        .exp-header {
          margin-bottom: 14px;
        }
        .exp-cargo {
          margin: 0 0 4px;
          font-size: 20px;
          color: #e6e9f2;
        }
        .exp-meta {
          margin: 0;
          font-size: 14px;
          color: #a5acc0;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .exp-empresa {
          color: #4fd1c5;
          font-weight: 500;
        }
        .exp-periodo::before {
          content: "·";
          margin-right: 12px;
          opacity: 0.5;
        }
        .exp-itens {
          margin: 0;
          padding-left: 20px;
          color: #c7cddc;
        }
        .exp-itens li {
          margin-bottom: 8px;
          font-size: 15px;
        }
        .exp-itens li::marker {
          color: #4fd1c5;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }
        .skill-card {
          background: #121935;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 22px;
        }
        .skill-categoria {
          margin: 0 0 14px;
          font-size: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #4fd1c5;
        }
        .skill-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .tag {
          background: rgba(79, 209, 197, 0.1);
          color: #e6e9f2;
          border: 1px solid rgba(79, 209, 197, 0.25);
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
        }

        .formacao-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .formacao-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 18px 22px;
          background: #121935;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
        }
        .formacao-titulo {
          margin: 0 0 2px;
          font-weight: 600;
          color: #e6e9f2;
        }
        .formacao-instituicao {
          margin: 0;
          font-size: 14px;
          color: #a5acc0;
        }
        .formacao-status {
          font-size: 13px;
          color: #4fd1c5;
          background: rgba(79, 209, 197, 0.1);
          padding: 4px 12px;
          border-radius: 999px;
          white-space: nowrap;
        }

        .footer {
          padding: 56px 0;
          background: #0a0f1f;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          text-align: center;
        }
        .footer-content p {
          margin: 0 0 12px;
          font-size: 18px;
          color: #a5acc0;
        }
        .footer-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition:
            transform 0.2s ease,
            filter 0.2s ease;
          filter: drop-shadow(0 8px 24px rgba(37, 211, 102, 0.35));
        }
        .footer-cta:hover {
          transform: translateY(-3px) scale(1.05);
          filter: drop-shadow(0 12px 32px rgba(37, 211, 102, 0.5));
          text-decoration: none;
        }
        .whatsapp-icon {
          width: 72px;
          height: 72px;
          display: block;
        }

        @media (max-width: 1280px) {
          .hero-content {
            padding: 0 32px 0 48px;
            gap: 40px;
          }
          .hero-avatar {
            width: 280px;
            height: 280px;
          }
        }

        @media (max-width: 1024px) {
          .hero {
            padding: 80px 0 64px;
          }
          .hero-content {
            flex-direction: column-reverse;
            align-items: center;
            text-align: center;
            gap: 36px;
            padding: 0 24px;
          }
          .hero-text {
            max-width: 720px;
            width: 100%;
          }
          .hero-summary {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-contact {
            justify-content: center;
          }
          .hero-avatar {
            width: 240px;
            height: 240px;
          }
        }

        @media (max-width: 600px) {
          .hero {
            padding: 64px 0 48px;
          }
          .hero-avatar {
            width: 180px;
            height: 180px;
          }
          .hero-contact {
            flex-direction: column;
            gap: 8px;
          }
          .hero-contact .dot {
            display: none;
          }
          .section {
            padding: 56px 0;
          }
          .section-title {
            font-size: 24px;
          }
          .exp-card {
            padding: 20px;
          }
          .formacao-item {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
}

export default Home;
