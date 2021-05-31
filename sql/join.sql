SELECT sections.id, sections.section_name, categories.id, categories.category_img, categories.section_id, skills.id, skills.skill_name, skills.skill_img, skills.category_id
FROM sections
INNER JOIN categories ON sections.id = categories.section_id
INNER JOIN skills ON skills.category_id = categories.id; 