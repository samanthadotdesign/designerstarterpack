INSERT INTO categories (category_name, category_img, section_id) VALUES
('Collaboration','/assets/categories/1-collaboration.svg', 1),
('Shape','/assets/categories/2-shape.svg', 2),
('Text', '/assets/categories/3-text.svg',2),
('Frame', '/assets/categories/4-frame.svg', 2),
('Auto Layout','/assets/categories/5-autolayout.svg', 2),
('Styles','/assets/categories/6-styles.svg', 3),
('Components','/assets/categories/7-components.svg',3),
('Design System','/assets/categories/8-designsystem.svg',3),
('Prototype','/assets/categories/9-prototype.svg',4),
('Advanced Prototyping','/assets/categories/10-advancedprototyping.svg',4),
('Design Ops','/assets/categories/11-designops.svg',5),
('Development','/assets/categories/12-dev.svg',5),
('Workshops','/assets/categories/13-workshops.svg',6),
('Coding For Figma','/assets/categories/14-coding.svg',6),
('Figma Magic','/assets/categories/15-magic.svg',6);

INSERT INTO skills (skill_name, skill_img, category_id) VALUES 
('Figma Interface','/assets/skills/1_figma_interface.svg', 1),
('View Prototype','/assets/skills/1_view_prototype.svg',1),
('Figma Links','/assets/skills/1_figma_links.svg',1),
('Comments','/assets/skills/1_comments.svg',1),
('Share Link','/assets/skills/1_share_link.svg',1),
('Move & Scale','/assets/skills/2_move_scale.svg',2),
('Shape & Line','/assets/skills/2_shape_line.svg',2),
('Images','/assets/skills/2_images.svg',2),
('Layer Properties','/assets/skills/2_layer_properties.svg',2),
('Vectors & Booleans','/assets/skills/2_vectors_booleans.svg',2),
('Masks','/assets/skills/2_masks.svg',2),
('Create Text & Lists','/assets/skills/3_create_text_lists.svg',3),
('Text Properties','/assets/skills/3_text_properties.svg',3),
('Text Alignment','/assets/skills/3_text_alignment.svg',3),
('Create Frames','/assets/skills/4_create_frames.svg',4),
('Organizing Frames','/assets/skills/4_organizing_frames.svg',4),
('Groups & Frames','/assets/skills/4_groups_frames.svg',4),
('Constraints in Frames','/assets/skills/4_organizing_frames.svg',4),
('Layout & Baseline Grids','/assets/skills/4_layout_baseline.svg',4),
('Auto Layout','/assets/skills/5_autolayout.svg',5),
('Packed & Space Between','/assets/skills/5_packed_space.svg',5),
('Nested Auto Layout','/assets/skills/5_nested.svg',5),
('Create Styles', '/assets/skills/6_create_styles.svg',6),
('Apply & Modify Styles','/assets/skills/6_apply_modify_styles.svg',6),
('Components','/assets/skills/7_components.svg',7),
('Variants','/assets/skills/7_variants.svg',7),
('Nested Components','/assets/skills/8_nested.svg', 8),
('Team Libraries','/assets/skills/8_team_libraries.svg',8),
('Connections','/assets/skills/9_connections.svg', 9),
('Animations', '/assets/skills/9_animations.svg', 9),
('Interactive Components','/assets/skills/9_interactive.svg', 9),
('Prototype Settings','/assets/skills/9_settings.svg',9),
('Prototype Organization','/assets/skills/10_prototype_organization.svg',10),
('Realistic Data','/assets/skills/10_realistic_data.svg', 10),
('Responsive Prototypes','/assets/skills/10_responsive_prototype.svg',10),
('Keyboard & Gamepad Interactions','/assets/skills/10_keypad.svg', 10),
('Design Ops', '/assets/skills/11_design_ops.svg',11),
('Development', '/assets/skills/12_dev.svg',12),
('Workshops','/assets/skills/13_workshops.svg', 13),
('Coding for Figma','/assets/skills/14_coding_for_figma.svg',14), 
('Figma Magic','/assets/skills/15_figma_magic.svg',15);


INSERT INTO resources (resource_name, resource_link, skill_id, contributor_id) VALUES
('Figma Tutorial: File Browser', 'https://www.youtube.com/watch?v=imKw17OVdAw', 1, 1),
('Figma For Beginners: Explore Ideas (1/4)', 'https://www.youtube.com/watch?v=dXQ7IHkTiMM&ab_channel=Figma', 1, 1);

INSERT INTO user_categories (user_id, category_id, category_completed) VALUES
(1, 1, true),
(1, 2, false); 

INSERT INTO user_skills (user_id, skill_id, skill_completed) VALUES
(1, 1, true),
(1, 2, true),
(1, 3, true),
(1, 4, true),
(1, 5, true),
(1, 6, true);

INSERT INTO sections (section_name) VALUES
('Getting Started'),
('Basics'),
('System'),
('Prototype'),
('Collaboration'),
('Advanced');