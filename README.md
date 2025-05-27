# Government of Yukon Lagoon Drupal 10 Template

## Introduction

This template is the starting point for all new "boutique" Drupal CMS websites
hosted by ICT - eServices.
A boutique website is one that has received approval to exist separately from
[yukon.ca](https://yukon.ca) or that is too large or technically complex to be
implemented as a campaign site within yukon.ca's CMS.

Once a new repository is created from this template, the website built from that
repo can run:

- locally in a development containerized environment managed by `ddev`,
- hosted atop the eServices Platform in either a TEST or PROD environment, or
- hosted atop the amazee.io Lagoon Platform under eServices' account.

## How to Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md)

## Licence

Unless otherwise noted, the source code of this project is distributed under the
[MIT License](LICENSE).

## Requirements

- ddev installed
- Lagoon CLI installed and configured

## Installation

### Install new site from template in local development environment

Ask eServices to provide a Drupal instance name for this project.
Instances made from this template will have names beginning with `lagoon-` and
contain only alphanumeric or hyphen characters.

1. Replace "lagoon-boutique-template" with the desired Drupal instance name,
   particularly in `.ddev/config.yaml` and `composer.json`.
2. Launch the development environment: `ddev start`
3. Visit the new site's Drupal installation page at a URL like
   `https://lagoon-instance-name.ddev.site`
4. Install the site with the following options:
   - Choose language: English
   - Installation profile: Minimal
   - Configure site: as desired but will be overridden shortly
5. Get the installation's site UUID: `ddev drush cget system.site uuid`
6. Replace the `uuid` value in `config/sync/system.site.yml` with the UUID from
   the previous step.
   Change the `name` value as desired.
7. Import the template's default configuration: `ddev drush cim -y`
8. Genuflect to the Drupal God: `ddev drush cr`
