module.exports = function (app, options) {
  var remotes = app.remotes();

  const convertQuery = function (req) {
    if (req.query) {
      const filter = {
        skip: 0,
        limit: 50,
        order: '',
        where: {}
      };
      if (req.query.filter) {
        try {
          const fields = JSON.parse(req.query.filter);
          for (let field in fields) {
            if (fields.hasOwnProperty(field)) {
              if (field === 'where') {
                // This query object is correctly parsed, do nothing
                return null;
              }
              if (Array.isArray(fields[field])) {
                filter.where[field] = {
                  'inq': fields[field]
                };
              } else {
                filter.where[field] = fields[field];
              }
            }
          }
        } catch (e) {
        }
      }
      if (req.query.sort) {
        try {
          filter.order = JSON.parse(req.query.sort).join(' ');
        } catch (e) {
        }
      }
      if (req.query.range) {
        try {
          const range = JSON.parse(req.query.range);
          filter.skip = range[0];
          filter.limit = range[1] - range[0] + 1;
        } catch (e) {
        }
      }
      return filter;
    }
    return null;
  };

  // Set Content-Range for all search requests
  const applyRange = function (ctx, next) {
    if (!ctx.res._headerSent) {
      let filter;
      let limit = 50;
      let skip = 0;
      if (ctx.args && ctx.args.filter) {
        filter = ctx.args.filter.where;
        limit = ctx.args.filter.limit;
        skip = ctx.args.filter.skip;
      }

      let name = this.pluralModelName || this.name;
      this.count(filter, function (err, count) {
        const last = Math.min(skip + limit, count);
        ctx.res.set('Access-Control-Expose-Headers', 'Content-Range');
        ctx.res.set('Content-Range', `${name.toLowerCase()} ${skip}-${last}/${count}`);
        next();
      });
    } else {
      next();
    }
  };

  var pattern = options && Array.isArray(options.pattern) ? options.pattern : ['*.find'];
  for (var i=pattern.length-1; i>=0; i--) {
    remotes.after(pattern[i], applyRange);
  }

  app.middleware('routes:before', function (req, res, next) {
    const filter = convertQuery(req);
    if (filter) {
      if (req.query) {
        delete req.query.filter;
        delete req.query.sort;
        delete req.query.range;
        req.query = {...req.query, filter: JSON.stringify(filter)};
      } else {
        req.query = {filter: JSON.stringify(filter)};
      }
    }
    next();
  });

};
