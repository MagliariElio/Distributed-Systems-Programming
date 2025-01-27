# Distributed-Systems-Programming  
This is the repository for Distributed Systems Programming, academic year 2024/2025.  

In this repository, you will find the `exam` folder, which contains my exam submission for the first session of 2025. The project received a grade of 29, and the oral exam was graded 30, resulting in a final score of 30 for the course.  

The only aspect that could be improved in the project is to modify the URI for the `POST` and `DELETE` requests. Currently, they are under `api/films/public/{filmId}/reviews/editrequests`. It would be more accurate to move them to `api/films/public/{filmId}/reviews/{reviewerId}/editrequests`. This change reflects the RESTful principle that these verbs correspond to creating and deleting a resource, which should be properly identified by a single URI.  

Other than this, the project is fully correct, and all tests executed by the professor were successfully passed. Additionally, the Postman JSON collection contains simple tests to verify the correctness of the code, even though such tests were not required.  

The file `Riassunto DSP` includes all the material needed to study the theory, complete the lab assignments, and successfully pass the course. Moreover, the repository includes all the lab exercises I completed. While my solutions differ slightly from those provided by the professor, they are in line with the proposed solutions. For the exam, I directly built upon my lab work.  

Finally, the `SCHEMI` folder contains all the useful diagrams for the most important chapters, which are excellent for revision.  

## Useful Link:  
- [Laboratory for Advanced System Software](https://lass.cs.umass.edu/~shenoy/courses/spring22/lectures/)  
This page contains notes with additional details about the topics covered in the course.