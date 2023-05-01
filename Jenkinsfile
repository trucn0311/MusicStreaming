pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
        sh 'python3 -m venv venv'
        sh 'source venv/bin/activate'
        sh 'pip install -r requirements.txt'
      }
    }

    stage('Test') {
      parallel {
        stage('Test Login Functionality') {
          when {
            branch 'user-auth'
          }
          steps {
            sh 'pytest tests/test_login.py'
          }
        }
        stage('Test Registration Functionality') {
          when {
            branch 'user-auth'
          }
          steps {
            sh 'pytest tests/test_registration.py'
          }
        }
      }
    }
  }
}