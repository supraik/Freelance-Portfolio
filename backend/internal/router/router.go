// backend/internal/router/router.go
package router

import (
	"database/sql"

	"github.com/gin-gonic/gin"

	"github.com/supraik/Freelance-Portfolio/internal/config"
	"github.com/supraik/Freelance-Portfolio/internal/handlers"
	"github.com/supraik/Freelance-Portfolio/internal/middleware"
	"github.com/supraik/Freelance-Portfolio/internal/repository"
	"github.com/supraik/Freelance-Portfolio/internal/services"
)

// New creates and configures the router
func New(db *sql.DB, cfg *config.Config) *gin.Engine {
	// Set Gin mode
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	// Global middleware
	r.Use(middleware.CORS(cfg.FrontendURL))
	r.Use(middleware.RequestLogger())

	// Initialize services
	emailService := services.NewEmailService(cfg)
	storageService := services.NewStorageService(cfg.UploadDir, cfg.MaxFileSize)
	cloudinaryService, err := services.NewCloudinaryService(cfg)
	if err != nil {
		panic("Failed to initialize Cloudinary: " + err.Error())
	}

	// Initialize repositories
	contactRepo := repository.NewContactRepository(db)
	galleryRepo := repository.NewGalleryRepository(db)
	userRepo := repository.NewUserRepository(db)
	portfolioSectionRepo := repository.NewPortfolioSectionRepository(db)

	// Initialize handlers
	contactHandler := handlers.NewContactHandler(contactRepo, emailService)
	galleryHandler := handlers.NewGalleryHandler(galleryRepo)
	authHandler := handlers.NewAuthHandler(userRepo, cfg)
	uploadHandler := handlers.NewUploadHandler(storageService)
	portfolioHandler := handlers.NewPortfolioHandler(portfolioSectionRepo, galleryRepo, cloudinaryService)

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"service": "portfolio-backend",
		})
	})

	// API routes
	api := r.Group("/api")
	{
		// Public routes
		api.POST("/contact", contactHandler.Submit)

		// Gallery routes (public read)
		api.GET("/galleries", galleryHandler.GetAll)
		api.GET("/galleries/:slug", galleryHandler.GetBySlug)

		// Authentication
		api.POST("/auth/login", authHandler.Login)
		// Optional: Uncomment to allow registration
		// api.POST("/auth/register", authHandler.Register)

		// Protected routes (admin only)
		admin := api.Group("/admin")
		admin.Use(middleware.AuthRequired(cfg.JWTSecret))
		{
			// Contact management
			admin.GET("/contacts", contactHandler.GetAll)
			admin.PATCH("/contacts/:id/read", contactHandler.MarkAsRead)

			// Portfolio sections
			admin.GET("/portfolio/sections", portfolioHandler.GetSections)
			admin.PUT("/portfolio/sections/:id/image", portfolioHandler.UpdateSectionImage)

			// Gallery management
			admin.POST("/galleries", galleryHandler.Create)
			admin.PUT("/galleries/:id", galleryHandler.Update)
			admin.DELETE("/galleries/:id", galleryHandler.Delete)

			// Image management
			admin.POST("/galleries/:id/images", galleryHandler.CreateImage)
			admin.DELETE("/images/:id", galleryHandler.DeleteImage)

			// Image upload
			admin.POST("/upload", uploadHandler.Upload)
			admin.POST("/upload/multiple", uploadHandler.UploadMultiple)
		}
	}

	// Serve uploaded files
	r.Static("/uploads", cfg.UploadDir)

	return r
}
