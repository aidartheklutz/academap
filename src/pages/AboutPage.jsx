import { Link } from "react-router";

export default function AboutPage() {
  return (
    <div className="about-page">
      <header className="about-header">
        <div className="about-header__content">
          <Link to="/" className="about-header__back" aria-label="Назад к карте">
            ← <span>Назад</span>
          </Link>
          <h1>О проекте Academap</h1>
        </div>
      </header>
      
      <main className="about-content">
        <div className="about-card animate-fade-in">
          <div className="about-section">
            <h2>Что такое Academap?</h2>
            <p>
              <strong>Academap</strong> — это интерактивная карта академических, образовательных и общественных событий города Бишкек. Наша цель — объединить студентов, исследователей и всех стремящихся к знаниям людей, предоставляя удобный доступ к актуальной информации о лекциях, конференциях, олимпиадах и волонтёрских возможностях.
            </p>
          </div>

          <div className="about-section">
            <h2>Направления событий</h2>
            <div className="about-categories">
              <div className="category-card">
                <span className="category-badge mun">Model UN</span>
                <p>Моделирование деятельности органов ООН для развития дипломатии, дебатов и лидерских навыков.</p>
              </div>
              <div className="category-card">
                <span className="category-badge conference">Конференции</span>
                <p>Научные и научно-практические обсуждения, обмен опытом, выступления ведущих экспертов.</p>
              </div>
              <div className="category-card">
                <span className="category-badge olympiad">Олимпиады</span>
                <p>Интеллектуальные состязания для школьников и студентов по различным дисциплинам.</p>
              </div>
              <div className="category-card">
                <span className="category-badge volunteering">Волонтёрство</span>
                <p>Социально значимые инициативы, участие в организации крупных мероприятий и благотворительность.</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Как это работает?</h2>
            <p>
              На карте отображаются активные события. Вы можете нажать на любой маркер, чтобы прочитать подробную информацию, узнать даты проведения и зарегистрироваться. Новые события регулярно добавляются через административную панель.
            </p>
          </div>

          <div className="about-actions">
            <Link to="/" className="about-button-primary">
              Перейти к карте
            </Link>
          </div>
        </div>
        
        <footer className="about-footer">
          <p>© {new Date().getFullYear()} Academap Bishkek. Все права защищены.</p>
          <div className="about-socials">
            <a href="https://github.com/aidartheklutz/academap" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg className="social-icon-svg"><use href="/icons.svg#github-icon" /></svg>
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
