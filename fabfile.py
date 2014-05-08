#!/usr/bin/python
# encoding: utf-8
from __future__ import with_statement
import time
import os
import sys
from fabric.api import cd, run, prefix, task, env, roles, settings
from fabric.colors import yellow, green
from contextlib import contextmanager as _contextmanager

BASEDIR = os.path.realpath(os.path.join(os.path.dirname(__file__),
                                        os.path.pardir))
sys.path.append(BASEDIR)
os.environ['DJANGO_SETTINGS_MODULE'] = 'service_areas.settings'

# globals
env.project = 'service_areas'
env.roledefs = {
    'production': ['ubuntu@54.235.156.174'],
}

env.path = '/home/ubuntu/service-area'
env.activate = 'source /home/ubuntu/.virtualenvs/service-areas/bin/activate'
env.colors = True
env.format = True


@_contextmanager
def virtualenv():
    with cd(env.path):
        with prefix(env.activate):
            yield

@task
@roles('production')
def test():
    run('uname -a')


@task
@roles('production')
def sync_migrate_db():
    "Migrate database"
    with virtualenv(), settings(user='ubuntu'):
        print(yellow('Syncing and Migrating database'))
        run('pip install -r requirements.txt')
        run('python manage.py syncdb')
        print(green('Done'))


@task
@roles('dev')
def pull(branch):
    "Pull files from git to server"
    with virtualenv(), settings(user='ubuntu'):
        print(yellow('Reset Head'))
        run("git checkout -f")
        run("git checkout %s" % branch)
        print(green('Done'))
        print(yellow('Pull files from server'))
        run("git pull origin master")
        print(green('Done'))
        run("git log -n 1")
        print(green('Done'))


@task
@roles('dev')
def restart():
    "Restart webserver"
    print(yellow('Restart server'))
    with virtualenv(), settings(user='ubuntu'):
        run("./restart.sh")
    print(green('Done'))


@task
@roles('dev')
def collectstatic():
    "collect static files"
    with virtualenv(), settings(user='ubuntu'):
        print(yellow("Collecting Files"))
        run("python manage.py collectstatic --noinput")
        print(green("Collect static complete!"))


@task
@roles('dev')
def deploy_dev(branch='master'):
    "Send files to server and restart webserver"
    pull(branch)
    sync_migrate_db()
    collectstatic()
    restart()


@task
@roles('production')
def deploy():
    """deploy to production server"""
    WORKON = 'source /home/ubuntu/.virtualenvs/service-areas/bin/activate'
    with prefix(WORKON), cd('/home/ubuntu/service_areas/'):
        run('git checkout -f')
        run('git pull')
        #clean pyc
        run('rm -rfv `find ./ | egrep -i "(pyc|.swp|˜)$"`')
        # install requirements
        run('pip install -r requirements.txt')
        run('python manage.py syncdb')
        run('python manage.py collectstatic --noinput')
        time.sleep(3)
        run('/home/ubuntu/service_areas/restart.sh', pty=False)
        sys.exit()
