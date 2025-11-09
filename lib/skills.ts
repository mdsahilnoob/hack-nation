// OPTIMIZED: Reduced to 50 most common skills for faster processing
// For full 171-skill list, see bottom of file (commented out)
const SKILLS = [
  // Top Programming Languages
  "Python", "JavaScript", "TypeScript", "Java", "C++", "Go", "SQL",
  
  // Top Frontend
  "React", "Angular", "Vue.js", "Next.js", "HTML", "CSS", "Tailwind CSS", "Redux",
  
  // Top Backend
  "Node.js", "Express", "Django", "Flask", "REST API", "GraphQL", "Microservices",
  
  // Top Databases
  "PostgreSQL", "MongoDB", "MySQL", "Redis", "Elasticsearch",
  
  // Top Cloud & DevOps
  "AWS", "Docker", "Kubernetes", "CI/CD", "Jenkins", "Terraform", "Azure", "GCP",
  
  // Top Data Science & ML
  "Machine Learning", "TensorFlow", "PyTorch", "Pandas", "NumPy", 
  "Data Analysis", "Deep Learning", "Natural Language Processing",
  
  // Essential Skills
  "Git", "Testing", "Agile", "Scrum", "Leadership", "Communication",
  "Problem Solving", "System Design", "API Development"
];

// FULL SKILL LIST (171 skills - uncomment and replace above to use all)
/*
const SKILLS = [
  // Programming Languages (18)
  "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust", "Ruby", "PHP",
  "Swift", "Kotlin", "Scala", "R", "MATLAB", "Perl", "Shell Scripting", "Bash",
  
  // Frontend Development (20)
  "React", "Angular", "Vue.js", "Next.js", "Svelte", "HTML", "CSS", "Sass", "LESS",
  "Tailwind CSS", "Bootstrap", "Material-UI", "Styled Components", "Webpack", "Vite",
  "Redux", "MobX", "jQuery", "Responsive Design", "Web Accessibility",
  
  // Backend Development (14)
  "Node.js", "Express", "Django", "Flask", "FastAPI", "Spring Boot", "Ruby on Rails",
  "ASP.NET", "Laravel", "GraphQL", "REST API", "gRPC", "WebSockets", "Microservices",
  
  // Databases (13)
  "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Cassandra", "DynamoDB",
  "Elasticsearch", "SQLite", "Oracle", "MariaDB", "Neo4j", "Couchbase",
  
  // Cloud & DevOps (19)
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Jenkins", "GitLab CI", "GitHub Actions",
  "Terraform", "Ansible", "CircleCI", "Travis CI", "CI/CD", "DevOps", "CloudFormation",
  "Heroku", "Vercel", "Netlify", "DigitalOcean",
  
  // Data Science & ML (28)
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Keras", "scikit-learn",
  "Data Analysis", "Pandas", "NumPy", "Natural Language Processing", "Computer Vision",
  "Neural Networks", "CNN", "RNN", "Transformer Models", "BERT", "GPT", "LLM",
  "Data Visualization", "Matplotlib", "Seaborn", "Plotly", "Tableau", "Power BI",
  "Big Data", "Spark", "Hadoop", "Feature Engineering", "Model Deployment",
  
  // Mobile Development (5)
  "React Native", "Flutter", "iOS Development", "Android Development", "Mobile App Development",
  
  // Testing & Quality (11)
  "Testing", "Jest", "Mocha", "Pytest", "Selenium", "Cypress", "Unit Testing",
  "Integration Testing", "Test-Driven Development", "Quality Assurance", "Debugging",
  
  // Version Control & Tools (6)
  "Git", "GitHub", "GitLab", "Bitbucket", "Version Control", "Code Review",
  
  // Design & UI/UX (8)
  "Figma", "Adobe XD", "Sketch", "UI/UX Design", "Wireframing", "Prototyping",
  "User Research", "Graphic Design",
  
  // Soft Skills (13)
  "Project Management", "Agile", "Scrum", "Leadership", "Team Collaboration",
  "Communication", "Problem Solving", "Critical Thinking", "Time Management",
  "Mentoring", "Public Speaking", "Technical Writing", "Documentation",
  
  // Security (8)
  "Cybersecurity", "Penetration Testing", "Security Best Practices", "OAuth", "JWT",
  "Encryption", "SSL/TLS", "Network Security",
  
  // Other Technologies (28)
  "API Development", "System Design", "Architecture", "Performance Optimization",
  "Code Review", "Technical Documentation", "Algorithms", "Data Structures",
  "Object-Oriented Programming", "Functional Programming", "Concurrent Programming",
  "Distributed Systems", "Load Balancing", "Caching", "Message Queues", "RabbitMQ",
  "Kafka", "Nginx", "Apache", "Linux", "Windows Server", "Monitoring", "Logging",
  "APM Tools", "New Relic", "Datadog", "Splunk"
];
*/

export default SKILLS;
