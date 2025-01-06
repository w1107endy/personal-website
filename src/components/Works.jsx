import { works } from '../data/works'

export default function Works() {
  return (
    <div className="grid-container">
      {works.map((work) => (
        <WorkCard key={work.title} {...work} />
      ))}
    </div>
  )
} 