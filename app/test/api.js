'use strict';

import mongoose from 'mongoose';

mongoose.connect(process.env.MONGOHQ_URL);