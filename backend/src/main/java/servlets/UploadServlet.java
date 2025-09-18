package servlets;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.nio.file.Paths;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import dao.UserDAO;

@WebServlet("/users/upload-image")
@MultipartConfig
public class UploadServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        String userId = request.getParameter("id");
        Part filePart = null;
        InputStream fileContent = null;
        PrintWriter out = null;

        try {
            if (userId == null || userId.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out = response.getWriter();
                out.write("{\"error\":\"Missing user ID\"}");
                return;
            }

            filePart = request.getPart("profileImage");
            if (filePart == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out = response.getWriter();
                out.write("{\"error\":\"No file uploaded\"}");
                return;
            }

            String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();
            fileContent = filePart.getInputStream();

            ServletContext ctx = getServletContext();
            UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
            
            if (userDAO == null) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out = response.getWriter();
                out.write("{\"error\":\"Server configuration error\"}");
                return;
            }

            String savedFileName = userDAO.saveProfileImage(userId, fileContent, fileName, ctx.getRealPath(""));

            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("application/json");
            out = response.getWriter();
            out.write("{\"profileImage\":\"" + savedFileName + "\"}");

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            if (out != null) {
                out.write("{\"error\":\"File upload failed: " + e.getMessage() + "\"}");
            }
            e.printStackTrace();
        } finally {
            if (out != null) {
                out.close();
            }
            if (fileContent != null) {
                try { fileContent.close(); } catch (IOException e) { }
            }
            if (filePart != null) {
                try { filePart.delete(); } catch (IOException e) { }
            }
        }
    }
}