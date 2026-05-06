# **Software Requirements Specification (SRS)**

## **Project Name: OpenScholar**

### **Version: 1.0**

### **Date: 23 February 2026**

### **Prepared By: Md. Shahriar Hossain Jihad**

---

# 

# **Version History**

| Version | Date | Description | Author |
| ----- | ----- | ----- | ----- |
| 1.0 | 23 Feb 2026 | Initial SRS Draft | Md. Shahriar Hossain Jihad |

# 

# 

# 

# **1\. Introduction**

## **1.1 Purpose**

The purpose of this Software Requirements Specification (SRS) is to define the requirements for **OpenScholar**, an open-access academic research publishing and sharing platform.

This document provides a detailed description of the system’s functional and non-functional requirements and serves as a reference for developers, testers, project supervisors, and university stakeholders.

Unlike traditional academic portals that focus only on functionality, this project emphasizes:

* Visual communication  
* User-centered design  
* Interactive interface design  
* Typography and layout systems  
* Data visualization  
* Multimedia integration

The core objective is to design a visually engaging, minimalistic, and user-friendly academic platform that enhances research discoverability through advanced UI/UX principles.

---

## **1.2 Background and Problem Statement**

Most academic research platforms suffer from:

* Research papers locked behind expensive paywalls.   
* Access requires institutional or business email credentials.   
* Student research lacks visibility  
* no centralized platform in Bangladesh.   
* Outdated interface design  
* Poor typography and readability  
* Cluttered dashboards  
* Complex navigation  
* Lack of visual hierarchy  
* Limited multimedia integration  
* Poor mobile responsiveness

As a result, users experience:

* Cognitive overload  
* Low engagement  
* Reduced usability  
* Poor reading experience

There is a need for a **modern, graphics-driven, interaction-focused academic platform** that improves the research experience through effective UI/UX design.

## **1.3 Project Objectives**

The primary objectives of OpenScholar are:

1. To provide a free and open-access research repository.  
2. To enable students to publish thesis and research papers easily.  
3. To increase research visibility within universities.  
4. To support multilingual interface (Bangla & English).  
5. To implement a secure, moderated publication workflow.  
6. To create a scalable system that can expand nationally and globally.

## **1.4 Proposed Solution**

OpenScholar will be a modern open source web application with a scalable backend architecture.

The platform will provide:

* Student profile creation and authentication  
* Research paper upload and metadata management  
* Admin approval workflow  
* Public search and filtering system  
* Free PDF reading and downloading  
* Analytics dashboard  
* Multilingual support  
* Role-based access control

The system will follow secure authentication protocols and open-access policies.

## **1.5 Scope**

### **In Scope**

* Web-based academic repository  
* Student account registration  
* Research paper submission system  
* Admin moderation system  
* Search and filter functionality  
* Download and citation export  
* Dashboard and analytics  
* Language switch feature

### **Out of Scope (Initial Phase)**

* DOI generation  
* International indexing integration  
* Peer-reviewed journal management  
* Paid subscription system

---

## **1.6 Intended Audience and Use**

This document is intended for:

* Software Developers  
* QA/Test Engineers  
* University Administration  
* Project Supervisors  
* Academic Review Committee

It will be used as a contractual and technical reference for system development and validation.

## **1.7 Target Users**

1. Undergraduate Students  
2. Graduate Students  
3. Research Scholars  
4. Faculty Members  
5. University Administrators  
6. Public Researchers

---

## **1.8 Definitions, Acronyms, Abbreviations**

| Term | Definition |
| ----- | ----- |
| SRS | Software Requirements Specification |
| Admin | System Administrator |
| DOI | Digital Object Identifier |
| RBAC | Role-Based Access Control |
| PDF | Portable Document Format |
| API | Application Programming Interface |

---

## **1.9 References**

1. Software Requirements Specification Guide  
2. Pressman, R., & Maxim, B., *Software Engineering: A Practitioner’s Approach*  
3. IEEE Std 830-1998  
4. ISO/IEC/IEEE 29148:2018  
5. Project PRD (OpenScholar) 

---

# 

# 

# 

# 

# **2\. Overall Description**

## **2.1 Product Perspective**

OpenScholar is a standalone web-based platform.

It acts as:

* A standalone academic platform  
* Act as a centralized academic repository.  
* Integrate with university email systems (optional).  
* Operate on cloud infrastructure.  
* A scalable SaaS-ready system

Future integrations:

* University systems  
* DOI providers  
* Plagiarism detection APIs  
* National research databases

---

## **2.2 Product Functions (High-Level Features)**

* User Registration & Authentication  
* Profile management   
* Role-Based Access Control  
* Research Paper Submission  
* Admin moderation   
* Search & Filtering System  
* Multilingual Support  
* Paper viewing  
* Analytics Dashboard  
* Download & Citation Export

---

## **2.3 User Classes and Characteristics**

| User Class | Description | Technical Expertise |
| ----- | ----- | ----- |
| Student | Uploads research | Basic–Moderate |
| Researcher  | Reads papers & Verifies publications | Moderate |
| Admin | Manages system & Moderates content  | Advanced |
| Public User | Reads/downloads papers | Basic |

---

## **2.4 Operating Environment**

* Web Application  
* Supported Browsers: Chrome, Firefox, Edge  
* Backend Server (Cloud-based \- Linux)  
* Database Server (Relational DB)  
* Operating System: Linux-based server  
* Internet connection required

---

## **2.5 Design and Implementation Constraints**

* Secure authentication system required.  
* Must support large file uploads  
* Must ensure secure authentication  
* Must be scalable  
* Must follow open-access policy  
* Must comply with university publication rules.  
* Must ensure data privacy compliance.  
* Large file upload support (≥ 50MB).

---

## **2.6 Assumptions and Dependencies**

### **Assumptions**

* Universities will verify student identity.  
* Universities will cooperate   
* Students will upload original work.  
* Internet connectivity is available.

### **Dependencies**

* Cloud hosting provider.  
* Email service  
* Storage service

---

# 

# 

# 

# 

# 

# 

# 

# 

# 

# **3\. Specific Requirements**

---

# **3.1 Functional Requirements**

---

## **3.1.1 User Registration**

**Description:** Users can create an account.  
**Priority:** Must-have  
**Stimulus:** User submits registration form.  
**Response:** System validates and creates account.

### **Functional Requirements:**

* FR-1.1: The system shall provide a registration form.  
* FR-1.1: The system shall support multiple types of user onboarding (Student, Researcher, Professional, Normal user)  
* FR-1.2: The system shall require email verification.  
* FR-1.3: The system shall allow role selection (Student/Admin).  
* FR-1.4: The system shall prevent duplicate email registration.  
* FR-1.5: The system shall store user credentials securely.  
* FR-1.6: The system shall maintain user sessions.

---

## **3.1.2 User Login**

**Description:** Authenticated access to dashboard.  
**Priority:** Must-have

* FR-2.1: The system shall provide login form.  
* FR-2.2: The system shall validate credentials.  
* FR-2.3: The system shall redirect authenticated users to the dashboard.  
* FR-2.4: The system shall show an error message for invalid login.  
* FR-2.5: The system shall support password reset.

---

## **3.1.3 User Profile**

* FR-3.1: The system shall allow profile editing.  
* FR-3.2: The system shall store academic information.  
* FR-3.3: The system shall display user publications.

---

## **3.1.4 Research Paper Submission**

**Description:** Student uploads research paper.  
**Priority:** Must-have

* FR-4.1: The system shall allow PDF upload.  
* FR-4.2: The system shall require metadata (title, abstract, and keywords).  
* FR-4.3: The system shall allow department selection.  
* FR-4.4: The system shall mark the submission as “Pending Approval."  
* FR-4.5: The system shall support version updates.  
* FR-4.6: The system shall allow draft saving.   
* FR-4.7: The system shall store paper author and co-author info  
* FR-4.8: The system shall store paper’s title, keyword, metadata, short description, and category info for each version  
* FR-4.9: The System shall support external authors 

---

## **3.1.5 Admin Approval**

**Description:** Admin reviews submissions.  
**Priority:** Must-have

* FR-5.1: The system shall allow admin to approve/reject.  
* FR-5.2: The system shall notify students of the decision.  
* FR-5.3: The system shall publish approved papers publicly.  
* FR-5.4: The system shall log moderation history.  
* FR-5.5: Admin shall manage users (view, suspend, activate) 

---

## **3.1.6 Search and Discovery**

**Description:** Users search research papers.  
**Priority:** Must-have

* FR-6.1: The system shall support keyword search.  
* FR-6.2: The system shall filter by research category and subcategory (Science, physics, chemistry, AI, computer vision, LLM, cybersecurity, etc.).  
* FR-6.3: The system shall filter by university.  
* FR-6.4: The system shall filter by department.  
* FR-6.5: The system shall filter by publication year.  
* FR-6.6: The system shall display search results within 2 seconds.

---

## **3.1.7 Download & Reading**

* FR-7.1: The system shall display paper details.  
* FR-7.2: The system shall provide a PDF viewer.  
* FR-7.3: The system shall allow free download.  
* FR-7.4: The system shall record download statistics.  
* FR-7.5: The system shall generate citation formats.

---

## **3.1.8 Multilingual Support**

* FR-8.1: The system shall provide a language switch option.  
* FR-8.2: The system shall support English and Bangla.  
* FR-8.3: The system shall save user language preference.

---

## **3.1.9 Analytics Dashboard**

* FR-9.1: The system shall display total publications.  
* FR-9.2: The system shall track views.  
* FR-9.3: The system shall display the most viewed papers.  
* FR-9.4: The system shall display university-wise statistics.  
* FR-9.5: The system shall track downloads.  
* FR-9.6: The system shall display statistics.

## **3.1.10 User Features**

* FR-10.1: The system shall allow reaction (Like, Love, Haha, Intelligent, etc.) to any published paper  
* FR-10.2: The system shall allow commenting and replying to comments by any logged-in or non-logged-in user.   
* FR-10.3: The system shall allow social media sharing of any published paper  
* FR-10.4: Users shall be able to follow/unfollow other users  
* FR-10.5: Users shall see suggested researchers   
* FR-10.6: Users shall be able to save (bookmark) papers   
* FR-10.7: Users shall be able to view saved papers   
* FR-10.8: The system shall display related papers based on category and keywords   
* FR-10.9: The system shall display global platform statistics (papers, users, downloads) 

---

# **3.2 Non-Functional Requirements**

---

## **3.2.1 Performance**

* NFR-1: 95% of pages shall load within 3 seconds.  
* NFR-2: System shall support 10,000 concurrent users.  
* NFR-3: Search results shall appear within 2 seconds.

---

## **3.2.2 Security**

* NFR-4: Passwords shall be encrypted.  
* NFR-5: System shall implement RBAC.  
* NFR-6: System shall prevent SQL injection.  
* NFR-7: Data transmission shall use HTTPS.  
* NFR-8: Admin access shall require multi-factor authentication (future).

---

## **3.2.3 Usability**

* NFR-9: A new user shall complete registration within 3 minutes.  
* NFR-10: Interface shall be mobile responsive.  
* NFR-11: Navigation shall require no more than 3 clicks to reach any major feature.  
* NFR-12: UI must be responsive 

---

## **3.2.4 Reliability**

* NFR-13: System uptime shall be 99%.  
* NFR-14: Daily automated backup required.  
* NFR-15: Data recovery shall be possible within 4 hours.

---

## **3.2.5 Scalability**

* NFR-16: System must support multi-university expansion

---

## **3.2.6 Maintainability**

* NFR-17: Code shall follow modular architecture.  
* NFR-18: API documentation shall be maintained.  
* NFR-19: System shall support version upgrades without downtime.

---

## **3.2.7 Portability**

* NFR-20: System shall be deployable on major cloud providers.  
* NFR-21: System shall support modern browsers.

---

# **3.3 External Interface Requirements**

---

## **3.3.1 User Interfaces**

* Dashboard interface.  
* Submission form.  
* Admin moderation panel.  
* Search results page.  
* Language switch option.  
* PDF viewer interface.  
* Focus Mode  
* Dark mode support  
* Reaction, comments and reply to comment  
* Share to social Media

---

## **3.3.2 Hardware Interfaces**

* Compatible with desktop, laptop, tablet, and mobile devices.

---

## **3.3.3 Software Interfaces**

* Email service (SMTP).  
* Database server (Relational DB).  
* Cloud storage system.  
* Future plagiarism API integration.

---

## **3.3.4 Communications Interfaces**

* HTTPS protocol.  
* RESTful API (future mobile app integration).  
* JSON data exchange format.

---

# 

# **4\. Supporting Information**

---

## **4.1 Requirements Traceability Matrix (RTM)**

**4.1.1 Functional Requirements Traceability Matrix**

| Req ID | Requirement Description | Module | Use Case | Test Case ID |
| ----- | ----- | ----- | ----- | ----- |
| FR-1.1 | Registration form | Auth | User Onboarding | TC-AUTH-01 |
| FR-1.2 | Email verification | Auth | Verify Email | TC-AUTH-02 |
| FR-1.3 | Role selection | Auth | Assign Role | TC-AUTH-03 |
| FR-1.4 | Prevent duplicate email | Auth | Validate Email | TC-AUTH-04 |
| FR-1.5 | Secure credential storage | Auth | Store User | TC-AUTH-05 |
| FR-1.6 | Maintain session | Auth | Login Session | TC-AUTH-06 |

---

| Req ID | Requirement Description | Module | Use Case | Test Case ID |
| ----- | ----- | ----- | ----- | ----- |
| FR-2.1 | Login form  | Auth  | Login User | TC-AUTH-07 |
| FR-2.2 | Validate credentials  | Auth  | Authenticate  | TC-AUTH-08 |
| FR-2.3 | Redirect to dashboard  | Auth  | Login Flow | TC-AUTH-09 |
| FR-2.4 | Error on invalid login  | Auth  | Error Handling | TC-AUTH-10 |
| FR-2.5 | Password reset  | Auth  | Reset Password | TC-AUTH-11 |
| FR-3.1 | Profile editing | User  | Update Profile | TC-USER-01 |
| FR-3.2 | Store academic info | User  |  Save Info | TC-USER-02 |
| FR-3.3 | Show publications | User  | View Papers | TC-USER-03 |

| FR-4.1 | Upload PDF | Paper | Submit Paper | TC-PAPER-01 |  
 | FR-4.2 | Add metadata | Paper | Add Details | TC-PAPER-02 |  
 | FR-4.3 | Select department | Paper | Assign Dept | TC-PAPER-03 |  
 | FR-4.4 | Set pending status | Paper | Submission Flow | TC-PAPER-04 |  
 | FR-4.5 | Version update | Paper | Update Paper | TC-PAPER-05 |  
 | FR-4.6 | Save draft | Paper | Draft Save | TC-PAPER-06 |

---

| FR-5.1 | Approve/reject paper | Admin | Moderation | TC-ADMIN-01 |  
 | FR-5.2 | Notify user | Admin | Notification | TC-ADMIN-02 |  
 | FR-5.3 | Publish paper | Admin | Publish Flow | TC-ADMIN-03 |  
 | FR-5.4 | Log moderation | Admin | Audit Log | TC-ADMIN-04 |

---

| FR-6.1 | Keyword search | Search | Search Query | TC-SEARCH-01 |  
 | FR-6.2 | Filter by category | Search | Filter Category | TC-SEARCH-02 |  
 | FR-6.3 | Filter by university | Search | Filter Univ | TC-SEARCH-03 |  
 | FR-6.4 | Filter by department | Search | Filter Dept | TC-SEARCH-04 |  
 | FR-6.5 | Filter by year | Search | Filter Year | TC-SEARCH-05 |  
 | FR-6.6 | Response within 2 sec | Search | Performance | TC-SEARCH-06 |

---

| FR-7.1 | Show paper details | Reading | View Paper | TC-READ-01 |  
 | FR-7.2 | PDF viewer | Reading | Read Paper | TC-READ-02 |  
 | FR-7.3 | Free download | Reading | Download | TC-READ-03 |  
 | FR-7.4 | Track downloads | Analytics | Log Download | TC-ANALYTICS-01 |  
 | FR-7.5 | Citation export | Reading | Export Citation | TC-READ-04 |

---

| FR-8.1 | Language switch | UI | Change Language | TC-UI-01 |  
 | FR-8.2 | English/Bangla support | UI | Localization | TC-UI-02 |  
 | FR-8.3 | Save preference | UI | Persist Lang | TC-UI-03 |

---

| FR-9.1 | Show total publications | Analytics | Dashboard | TC-ANALYTICS-02 |  
 | FR-9.2 | Track views | Analytics | View Count | TC-ANALYTICS-03 |  
 | FR-9.3 | Most viewed papers | Analytics | Ranking | TC-ANALYTICS-04 |  
 | FR-9.4 | University stats | Analytics | Stats | TC-ANALYTICS-05 |  
 | FR-9.5 | Track downloads | Analytics | Metrics | TC-ANALYTICS-06 |  
 | FR-9.6 | Show statistics | Analytics | Dashboard | TC-ANALYTICS-07 |

---

**4.1.2 Non-Functional Requirements Traceability Matrix**

**2.1 Performance** 

| Req ID | Requirement | Test Case |
| ----- | ----- | ----- |
| NFR-1 | Page load \< 3 sec | TC-PERF-01 |
| NFR-2 | 10k users support | TC-PERF-02 |
| NFR-3 | Search \< 2 sec | TC-PERF-03 |

**2.2 Security** 

| Req ID | Requirement | Test Case |
| ----- | ----- | ----- |
| NFR-4 | Password encryption | TC-SEC-01 |
| NFR-5 | RBAC | TC-SEC-02 |
| NFR-6 | SQL injection prevention | TC-SEC-03 |
| NFR-7 | HTTPS | TC-SEC-04 |
| NFR-8 | MFA (future) | TC-SEC-05 |

**2.3 Usability** 

| Req ID | Requirement | Test Case |
| ----- | ----- | ----- |
| NFR-9 | Registration \< 3 min | TC-UX-01 |
| NFR-10 | Mobile responsive | TC-UX-02 |
| NFR-11 | ≤3 clicks navigation | TC-UX-03 |
| NFR-12 | Responsive UI | TC-UX-04 |

**2.4 Reliability** 

| Req ID | Requirement | Test Case |
| ----- | ----- | ----- |
| NFR-13 | 99% uptime | TC-REL-01 |
| NFR-14 | Daily backup | TC-REL-02 |
| NFR-15 | Recovery within 4h | TC-REL-03 |

**2.5 Scalability** 

| Req ID | Requirement | Test Case |
| ----- | ----- | ----- |
| NFR-16 | Multi-university support | TC-SCALE-01 |

**2.6 Maintainability** 

| Req ID | Requirement | Test Case |
| ----- | ----- | ----- |
| NFR-17 | Modular architecture | TC-MAIN-01 |
| NFR-18 | API documentation | TC-MAIN-02 |
| NFR-19 | Version upgrade support | TC-MAIN-03 |

**2.7 Portability** 

| Req ID | Requirement | Test Case |
| ----- | ----- | ----- |
| NFR-20 | Cloud deployable | TC-PORT-01 |
| NFR-21 | Browser support | TC-PORT-02 |

---

**4.1.3 Interface Requirements Traceability Matrix** 

3.1 UI Interfaces 

| Feature | Test Case |
| ----- | ----- |
| Dashboard | TC-UI-05 |
| Submission form | TC-UI-06 |
| Admin panel | TC-UI-07 |
| Search page | TC-UI-08 |
| PDF viewer | TC-UI-09 |
| Focus mode | TC-UI-10 |
| Dark mode | TC-UI-11 |

3.2 Software Interfaces 

| Interface | Test Case |
| ----- | ----- |
| Email SMTP | TC-INT-01 |
| Database | TC-INT-02 |
| Cloud Storage | TC-INT-03 |
| API Integration | TC-INT-04 |

3.3 Communication Interfaces 

| Interface | Test Case |
| ----- | ----- |
| HTTPS | TC-COM-01 |
| REST API | TC-COM-02 |
| JSON format | TC-COM-03 |

---

## **4.2 Analysis Models (To Be Attached)**

* Use Case Diagram  
* ER Diagram  
* Activity Diagram  
* Data Flow Diagram (DFD)

---

## **4.3 Approval and Sign-off**

| Role | Name | Signature | Date |
| ----- | ----- | ----- | ----- |
| Project Owner | Md. Shahriar Hossain Jihad |  |  |
| Supervisor |  |  |  |
| Developer | Md. Shahriar Hossain Jihad |  |  |

---

# 

# **Conclusion**

This SRS defines the complete requirement specification of OpenScholar following standard SRS structure and principles. All requirements are written in clear, testable, and unambiguous format using “shall” statements as recommended in SRS best practices

