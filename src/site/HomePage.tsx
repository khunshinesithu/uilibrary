import { components } from "../registry";

export function HomePage() {
  return (
    <>
      <section className="intro">
        <h1>Components</h1>
        <p>Components I saved. Open one and copy the code.</p>
      </section>

      <ul className="grid">
        {components.map((c) => (
          <li key={c.slug}>
            <a className="card" href={`#/${c.slug}`}>
              <h2>{c.name}</h2>
              <p>{c.description}</p>
              {c.stack?.length ? (
                <div className="tags">
                  {c.stack.map((s) => (
                    <span className="tag" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
