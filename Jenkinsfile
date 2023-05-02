pipeline {
    agent any

    stages {
     
        stage ('Unit'){
            steps{
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                    sh 'npm test'
                }
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                    sh 'npm -- --coverage'
                }
                                    

                publishHTML (
                    target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: false,
                    keepAll: true,
                    reportDir: 'coverage',
                    reportFiles: 'index.html',
                    reportName: "Coverage Report"
                ])
            }
        }
           
        stage('Build') {
            when {
                branch 'master'
            }
            steps {
                sh "docker build -t streaming_jest_test:${GIT_BRANCH}_${GIT_COMMIT} ."
                echo 'docker push ...'
            }
        }
        stage('Deploy') {
            when {
                branch 'master'
            }
            steps {
                echo 'Deploying....'
            }
        }
    }
}