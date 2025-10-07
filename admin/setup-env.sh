#!/bin/bash

# Environment Setup Script for NZ Grocery Admin
# This script helps set up environment files for different environments

echo "🌍 NZ Grocery Admin - Environment Setup"
echo "======================================"

# Function to create environment file
create_env_file() {
    local env_name=$1
    local source_file="env.example"
    local target_file="env.${env_name}"
    
    if [ -f "$target_file" ]; then
        echo "⚠️  $target_file already exists. Skipping..."
        return
    fi
    
    if [ -f "$source_file" ]; then
        cp "$source_file" "$target_file"
        echo "✅ Created $target_file from $source_file"
        echo "📝 Please edit $target_file with your environment-specific values"
    else
        echo "❌ $source_file not found. Please create it first."
        return 1
    fi
}

# Check if env.example exists
if [ ! -f "env.example" ]; then
    echo "❌ env.example file not found!"
    echo "Please create env.example first with all required environment variables."
    exit 1
fi

echo ""
echo "📋 Available environments:"
echo "1. local (for development)"
echo "2. staging (for testing)"
echo "3. production (for live deployment)"
echo "4. all (create all environments)"
echo ""

read -p "Select environment to setup (1-4): " choice

case $choice in
    1)
        create_env_file "local"
        echo ""
        echo "🚀 Next steps:"
        echo "1. Edit env.local with your development settings"
        echo "2. Run: npm run dev"
        ;;
    2)
        create_env_file "staging"
        echo ""
        echo "🚀 Next steps:"
        echo "1. Edit env.staging with your staging settings"
        echo "2. Run: npm run build:staging"
        ;;
    3)
        create_env_file "production"
        echo ""
        echo "🚀 Next steps:"
        echo "1. Edit env.production with your production settings"
        echo "2. Run: npm run build:prod"
        ;;
    4)
        create_env_file "local"
        create_env_file "staging"
        create_env_file "production"
        echo ""
        echo "🚀 Next steps:"
        echo "1. Edit each environment file with appropriate settings"
        echo "2. Use the corresponding npm commands for each environment"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📚 For more information, see ENVIRONMENT_SETUP.md"
echo "🎉 Environment setup complete!"
