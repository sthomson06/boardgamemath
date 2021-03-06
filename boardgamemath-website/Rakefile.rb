require 'rubygems'

task :default => :build

desc "Setup or update the environment to run Awestruct"
task :setup do
  system "bundle update"
end

desc "Clean out generated site and temporary files"
task :clean do
  require 'fileutils'
  system("echo Cleaning...")
  ['.awestruct', '.sass-cache', '_site', '_tmp'].each do |dir|
    FileUtils.remove_dir dir unless !File.directory? dir
  end
end

desc "Build the site"
task :build => :check do
  system("echo Building...")
  system "bundle exec awestruct -P production --force"
end

desc "Build the site and publish"
task :publish => [:check, :clean, :build] do
  system("echo Publishing...")
  system("rm -Rf ../local/publishTmp")
  system("git fetch origin")
  system("mkdir ../local/publishTmp")
  system("cp -r ../.git ../local/publishTmp/.")
  system("cd ../local/publishTmp; git checkout gh-pages; git rebase origin/gh-pages")
  system("cp -Rf _site/* ../local/publishTmp/.")
  system("cd ../local/publishTmp; git add .")
  system("cd ../local/publishTmp; git commit -m\"Automatic publish\"")
  system("cd ../local/publishTmp; git push origin gh-pages")
end

desc "Travis continuous integration task"
task :travis => [:clean, :build] do
end

task :check do
  begin
    require 'bundler'
    Bundler.setup
  rescue StandardError => e
    puts "\e[31m#{e.message}\e[0m"
    puts "\e[33mRun `rake setup` to install required gems.\e[0m"
    exit e.status_code
  end
  Dir.mkdir('_tmp') unless Dir.exist?('_tmp')
end
