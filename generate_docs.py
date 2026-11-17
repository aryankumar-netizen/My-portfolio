import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)

def generate_resume_docx():
    doc = docx.Document()
    
    # 0.5 inch margins for A4 single-page layout
    for section in doc.sections:
        section.top_margin = Inches(0.4)
        section.bottom_margin = Inches(0.4)
        section.left_margin = Inches(0.4)
        section.right_margin = Inches(0.4)
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)

    # 2-column table: Left Column (Dark Slate #0F172A), Right Column (White #FFFFFF)
    table = doc.add_table(rows=1, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    # Widths
    col_widths = [Inches(2.6), Inches(4.85)]
    for row in table.rows:
        row.cells[0].width = col_widths[0]
        row.cells[1].width = col_widths[1]

    left_cell = table.cell(0, 0)
    right_cell = table.cell(0, 1)

    set_cell_background(left_cell, "0F172A")
    set_cell_background(right_cell, "FFFFFF")
    set_cell_margins(left_cell, top=200, bottom=200, left=200, right=200)
    set_cell_margins(right_cell, top=200, bottom=200, left=250, right=200)

    # --- LEFT CELL CONTENT ---
    # Monogram Badge
    p_mono = left_cell.paragraphs[0]
    p_mono.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_mono = p_mono.add_run("[ AK ]\n")
    r_mono.font.name = 'Arial'
    r_mono.font.size = Pt(22)
    r_mono.font.bold = True
    r_mono.font.color.rgb = RGBColor(200, 245, 88)

    r_name = p_mono.add_run("ARYAN KUMAR\n")
    r_name.font.name = 'Arial'
    r_name.font.size = Pt(13)
    r_name.font.bold = True
    r_name.font.color.rgb = RGBColor(255, 255, 255)

    r_title = p_mono.add_run("Full Stack & Shopify Specialist")
    r_title.font.name = 'Arial'
    r_title.font.size = Pt(8.5)
    r_title.font.color.rgb = RGBColor(200, 245, 88)
    p_mono.paragraph_format.space_after = Pt(10)

    # Left Sections Helper
    def add_left_section(title, lines):
        p = left_cell.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(title.upper())
        r.font.name = 'Arial'
        r.font.size = Pt(8.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(200, 245, 88)

        for label, val in lines:
            lp = left_cell.add_paragraph()
            lp.paragraph_format.space_after = Pt(2)
            lp.paragraph_format.line_spacing = 1.15
            
            rl = lp.add_run(f"{label}: " if label else "")
            rl.font.name = 'Arial'
            rl.font.size = Pt(7.5)
            rl.font.bold = True
            rl.font.color.rgb = RGBColor(148, 163, 184)
            
            rv = lp.add_run(val)
            rv.font.name = 'Arial'
            rv.font.size = Pt(7.8)
            rv.font.color.rgb = RGBColor(241, 245, 249)

    add_left_section("Contact", [
        ("Location", "Karachi, Sindh, Pakistan"),
        ("Status", "Available for Remote / Contracts"),
        ("Timezone", "PKT (UTC+05:00)"),
    ])

    add_left_section("Verified Profiles", [
        ("LinkedIn", "https://www.linkedin.com/in/aryan-kumar-99681443a/"),
        ("Upwork", "https://www.upwork.com/freelancers/~01c5ace242e3d3f9a1?viewMode=1"),
        ("Freelancer", "https://www.freelancer.com/u/aryankumardev"),
        ("GitHub", "https://github.com"),
    ])

    add_left_section("Skills Matrix", [
        ("Front-End", "HTML5, CSS3, JavaScript ES6+, Bootstrap 5, jQuery, Responsive UI, Figma UI/UX"),
        ("Back-End & DB", "Core PHP 8, MySQL 3NF, Web APIs, Laravel (Starting), JSON, XML, XSL"),
        ("E-Commerce", "Shopify Store Design, Product Catalog Mgmt, WordPress, Web Hosting, SEO, Git"),
    ])

    add_left_section("Education", [
        ("2025 – Present", "3-Year IT ACCP AI Diploma\nAptech Computer Education, Karachi\n(Completed 1st Year: Frontend, PHP & MySQL; starting Laravel)"),
        ("2025 – Present", "Intermediate (12th Class) — CS\nHigher Secondary Board, Karachi"),
        ("Completed", "Matriculation (Computer Science)\nWoodland Secondary School, North Karachi\n(1st Position Holder among Boys • Graduated #1)"),
    ])

    # --- RIGHT CELL CONTENT ---
    # Header
    p_head = right_cell.paragraphs[0]
    p_head.paragraph_format.space_after = Pt(2)
    r_rname = p_head.add_run("ARYAN KUMAR\n")
    r_rname.font.name = 'Arial'
    r_rname.font.size = Pt(17)
    r_rname.font.bold = True
    r_rname.font.color.rgb = RGBColor(15, 23, 42)

    r_rtitle = p_head.add_run("Full Stack Web Developer • Shopify Store Specialist\n")
    r_rtitle.font.name = 'Arial'
    r_rtitle.font.size = Pt(9.5)
    r_rtitle.font.bold = True
    r_rtitle.font.color.rgb = RGBColor(2, 132, 199)

    r_rmeta = p_head.add_run("Karachi, Pakistan • Available via LinkedIn, Upwork & Freelancer")
    r_rmeta.font.name = 'Arial'
    r_rmeta.font.size = Pt(8)
    r_rmeta.font.color.rgb = RGBColor(100, 116, 139)

    # Right Sections Helper
    def add_right_heading(title):
        p = right_cell.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(3)
        r = p.add_run(title.upper())
        r.font.name = 'Arial'
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = RGBColor(15, 23, 42)

    # Summary
    add_right_heading("Executive Summary")
    p_prof = right_cell.add_paragraph()
    p_prof.paragraph_format.space_after = Pt(6)
    p_prof.paragraph_format.line_spacing = 1.15
    r_prof = p_prof.add_run(
        "Full Stack Web & E-Commerce Developer based in Karachi, Pakistan, pursuing a 3-Year IT ACCP AI Diploma at Aptech and Intermediate Computer Science. Graduated as 1st Position Holder among Boys at Woodland Secondary School. Specialized in engineering dynamic Core PHP & MySQL web apps, performant responsive frontends (HTML5/CSS3/JavaScript), high-converting Shopify & WordPress stores, and deploying production-grade digital products."
    )
    r_prof.font.name = 'Arial'
    r_prof.font.size = Pt(8.2)
    r_prof.font.color.rgb = RGBColor(51, 65, 85)

    # Experience
    add_right_heading("Professional Experience")
    p_exp = right_cell.add_paragraph()
    p_exp.paragraph_format.space_after = Pt(2)
    r_exp_t = p_exp.add_run("Freelance Web & E-Commerce Developer  |  2025 – Present\n")
    r_exp_t.font.name = 'Arial'
    r_exp_t.font.size = Pt(8.5)
    r_exp_t.font.bold = True
    r_exp_t.font.color.rgb = RGBColor(15, 23, 42)

    r_exp_s = p_exp.add_run("Self-Employed • Remote Client Deliveries")
    r_exp_s.font.name = 'Arial'
    r_exp_s.font.size = Pt(7.8)
    r_exp_s.font.color.rgb = RGBColor(100, 116, 139)

    bullets = [
        "Architected custom relational web backends in Core PHP and MySQL with normalized 3NF schemas, password encryption, and custom admin portals.",
        "Designed, configured, and deployed Shopify and WordPress storefronts (customizing modern themes), structuring product catalog setups and checkouts.",
        "Engineered pixel-perfect, mobile-first responsive frontends using modern JavaScript (ES6+), HTML5, CSS3, jQuery, and Bootstrap 5.",
        "Configured commercial web hosting environments, SSL security, domain mapping, technical SEO audits, and Git/GitHub version control workflows."
    ]
    for b in bullets:
        bp = right_cell.add_paragraph()
        bp.paragraph_format.space_after = Pt(2)
        bp.paragraph_format.line_spacing = 1.1
        rb = bp.add_run(f"• {b}")
        rb.font.name = 'Arial'
        rb.font.size = Pt(8)
        rb.font.color.rgb = RGBColor(51, 65, 85)

    # Production Projects
    add_right_heading("Featured Production Projects")
    projects = [
        (
            "1. VEBRA — Music & E-Commerce Web Application",
            "Tech: Core PHP, MySQL, JavaScript, Bootstrap, PHPMailer | Demo: vebraofficial.great-site.net",
            "Full-stack music streaming and vinyl e-commerce web application featuring user authentication, dynamic artist/song database, shopping cart, and custom Admin Dashboard."
        ),
        (
            "2. FurEver Care — Pet Wellness & Veterinary Portal",
            "Tech: HTML5, CSS3, Vanilla JavaScript, JSON, LocalStorage | UI/UX Prototype Showcase",
            "Interactive pet care platform built with Vanilla JavaScript and JSON data schemas featuring a Personalized Pet Owner Journey, Companion Health Journal with LocalStorage, Feeding Portion Calculator, and 24/7 Emergency Triage guide."
        ),
        (
            "3. Excellent Coaching — Multi-Page Learning Platform",
            "Tech: HTML5, CSS3, Bootstrap, jQuery | Demo: aryankumar-netizen.github.io/Excellent_Coaching",
            "Responsive multi-page educational website with course categories, instructor profiles, student testimonials, and interactive sliders."
        )
    ]

    for p_title, p_tech, p_desc in projects:
        pp = right_cell.add_paragraph()
        pp.paragraph_format.space_before = Pt(4)
        pp.paragraph_format.space_after = Pt(1)
        rt = pp.add_run(f"{p_title}\n")
        rt.font.name = 'Arial'
        rt.font.size = Pt(8.2)
        rt.font.bold = True
        rt.font.color.rgb = RGBColor(15, 23, 42)

        r_t = pp.add_run(f"{p_tech}\n")
        r_t.font.name = 'Arial'
        r_t.font.size = Pt(7.5)
        r_t.font.bold = True
        r_t.font.color.rgb = RGBColor(2, 132, 199)

        rd = pp.add_run(p_desc)
        rd.font.name = 'Arial'
        rd.font.size = Pt(7.8)
        rd.font.color.rgb = RGBColor(71, 85, 105)

    import os
    os.makedirs("Submission_Docs", exist_ok=True)
    doc.save("Aryan_Kumar_CV_Resume.docx")
    doc.save(os.path.join("Submission_Docs", "Aryan_Kumar_CV_Resume.docx"))
    print("Aryan_Kumar_CV_Resume.docx generated successfully in root and Submission_Docs/.")

def generate_cover_letter_docx():
    doc = docx.Document()
    
    # 0.75 inch margins
    for section in doc.sections:
        section.top_margin = Inches(0.65)
        section.bottom_margin = Inches(0.65)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)

    # Header
    p_head = doc.add_paragraph()
    p_head.paragraph_format.space_after = Pt(4)
    r_name = p_head.add_run("ARYAN KUMAR\n")
    r_name.font.name = 'Arial'
    r_name.font.size = Pt(18)
    r_name.font.bold = True
    r_name.font.color.rgb = RGBColor(15, 23, 42)

    r_role = p_head.add_run("Full Stack Web Developer • Shopify Store Specialist\n")
    r_role.font.name = 'Arial'
    r_role.font.size = Pt(9.5)
    r_role.font.bold = True
    r_role.font.color.rgb = RGBColor(2, 132, 199)

    r_meta = p_head.add_run("Karachi, Sindh, Pakistan • Available via LinkedIn / Upwork / Freelancer\nProfiles: linkedin.com/in/aryan-kumar-99681443a • upwork.com • freelancer.com/u/aryankumardev")
    r_meta.font.name = 'Arial'
    r_meta.font.size = Pt(8)
    r_meta.font.color.rgb = RGBColor(100, 116, 139)

    # Recipient
    p_rec = doc.add_paragraph()
    p_rec.paragraph_format.space_before = Pt(10)
    p_rec.paragraph_format.space_after = Pt(8)
    r_rec = p_rec.add_run("Date: November 16, 2026\nTo: The Technical Hiring Team / Project Director\nFocus: Full-Stack Web Development, PHP/MySQL, Responsive UI & Shopify Architecture")
    r_rec.font.name = 'Arial'
    r_rec.font.size = Pt(8.5)
    r_rec.font.color.rgb = RGBColor(51, 65, 85)

    # Subject
    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_after = Pt(10)
    r_sub = p_sub.add_run("SUBJECT: Application for Full-Stack Web Developer & Shopify Specialist")
    r_sub.font.name = 'Arial'
    r_sub.font.size = Pt(10)
    r_sub.font.bold = True
    r_sub.font.color.rgb = RGBColor(15, 23, 42)

    # Body
    paragraphs = [
        "Dear Hiring Manager and Technical Leadership,",
        "I am writing to express my enthusiastic interest in collaborating with your team as a Full Stack Web Developer and Shopify Store Specialist. As a 17-year-old developer and Computer Science student in Karachi, I have combined rigorous academic discipline — graduating as 1st Position Holder among Boys at Woodland Secondary School — with intensive practical training in my 3-Year IT ACCP AI Diploma at Aptech, where I completed my 1st Year with distinction (Frontend HTML/CSS/JS, PHP/MySQL, XML/XSL, and Technical SEO) and am currently expanding into Laravel.",
        "My professional practice bridges relational database backend architecture, interactive frontend engineering, and conversion-focused e-commerce storefronts. I have built and published three production-grade flagship applications:",
        "1. VEBRA Media: Full-stack music streaming and vinyl e-commerce web app built with Core PHP, MySQL, JavaScript, Bootstrap, and PHPMailer, featuring normalized 3NF schemas, password hashing, and a custom Admin Dashboard (vebraofficial.great-site.net • github.com).\n2. FurEver Care: Interactive pet care and veterinary portal built with HTML5, CSS3, Vanilla JavaScript, and JSON data schemas, featuring a Personalized Pet Owner Journey, Companion Health Journal with LocalStorage, Feeding Portion Calculator, and 24/7 Emergency Triage guide (UI/UX Prototype Showcase • github.com).\n3. Excellent Coaching: Responsive multi-page educational platform built with HTML5, CSS3, Bootstrap, and jQuery, featuring course category grids, instructor profiles, student testimonials, and interactive sliders (aryankumar-netizen.github.io/Excellent_Coaching • github.com).",
        "In the e-commerce space, I design and configure Shopify stores (customizing free and modern themes) and manage structured product catalogs, alongside WordPress setups and commercial web hosting deployments. I also adhere to disciplined Git/GitHub version control and technical SEO audits to guarantee high search engine rankings and zero-downtime launches.",
        "With a track record of academic excellence, self-driven work ethic, and relentless passion for writing clean, fast, and maintainable code, I am eager to deliver immediate value to your digital products. I look forward to discussing how my skillset aligns with your development goals.",
        "Thank you for your consideration and time."
    ]

    for p_text in paragraphs:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.line_spacing = 1.15
        r = p.add_run(p_text)
        r.font.name = 'Arial'
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(51, 65, 85)

    # Signoff
    p_sign = doc.add_paragraph()
    p_sign.paragraph_format.space_before = Pt(8)
    p_sign.paragraph_format.space_after = Pt(2)
    rs_s = p_sign.add_run("Sincerely,\n")
    rs_s.font.name = 'Arial'
    rs_s.font.size = Pt(8.5)
    rs_s.font.color.rgb = RGBColor(51, 65, 85)

    rs_n = p_sign.add_run("ARYAN KUMAR\n")
    rs_n.font.name = 'Arial'
    rs_n.font.size = Pt(11)
    rs_n.font.bold = True
    rs_n.font.color.rgb = RGBColor(15, 23, 42)

    rs_t = p_sign.add_run("Full Stack Web Developer • Shopify Store Specialist\nKarachi, Pakistan • Available via LinkedIn, Upwork & Freelancer")
    rs_t.font.name = 'Arial'
    rs_t.font.size = Pt(8)
    rs_t.font.color.rgb = RGBColor(2, 132, 199)

    import os
    os.makedirs("Submission_Docs", exist_ok=True)
    doc.save("Aryan_Kumar_Cover_Letter.docx")
    doc.save(os.path.join("Submission_Docs", "Aryan_Kumar_Cover_Letter.docx"))
    print("Aryan_Kumar_Cover_Letter.docx generated successfully in root and Submission_Docs/.")

if __name__ == "__main__":
    generate_resume_docx()
    generate_cover_letter_docx()
